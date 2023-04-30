import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from a2c_helpers import *
from sklearn.preprocessing import MinMaxScaler

# define the environment parameters
num_transformers = 5
max_kWh = 1000
max_time = 24
max_population = 5000

# define the actor-critic network


class ActorCritic(nn.Module):
    def __init__(self):
        super(ActorCritic, self).__init__()
        # define the shared layers
        self.shared_layers = nn.Sequential(
            nn.Linear(6, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU()
        )
        # define the actor head
        self.actor = nn.Sequential(
            nn.Linear(64, num_transformers),
            nn.Softmax(dim=-1)
        )
        # define the critic head
        self.critic = nn.Linear(6, 1)

    def forward(self, state):
        # state_np = np.concatenate(np.array([tf.get_params() for tf in state]))
        x = self.shared_layers(state)
        actor_logits = self.actor(x)
        value = self.critic(state)
        return actor_logits, value


class A2C:
    def __init__(self, env):
        self.env = env
        self.gamma = 0.90
        self.lr = 1e-3
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu")

        self.actor_critic = ActorCritic().to(self.device)
        self.optimizer = optim.Adam(self.actor_critic.parameters(), lr=self.lr)

    def select_action(self, state):
        count = 0
        state_np = np.concatenate(np.array([tf.get_params() for tf in state]))
        state_np = np.reshape(state_np, (5, 6))
        # convert the state to a tensor
        state_np = torch.from_numpy(state_np).float().to(self.device)
        # get the actor logits from the network
        actor_logits, _ = self.actor_critic(state_np)
        # exclude already fixed transformers from the actor distribution
        for tf in state:
            if not tf.get_status:
                actor_logits[:, count] = float('-inf')
            count += 1
        # sample an action from the actor distribution
        dist = torch.distributions.Categorical(logits=actor_logits)
        actions = torch.argsort(dist.probs, descending=True)
        action = actions[0]
        for action in action:
            if not state[action.item()].get_status():
                continue
            else:
                return action.item()
        return action.item()

    def update(self, rollout):
        count = 0
        # unpack the rollout
        states_tf = rollout[0][0]
        _, states, actions, rewards, next_states, dones = (
            np.array(val) for val in rollout)

        # convert the rollout data to tensors
        states = torch.from_numpy(states).float().to(self.device)
        actions = torch.from_numpy(actions).long().to(self.device)
        rewards = torch.from_numpy(rewards).float().to(self.device)
        next_states = torch.from_numpy(next_states).float().to(self.device)
        dones = torch.from_numpy(dones.astype(
            np.uint8)).float().to(self.device)

        # compute the returns and advantages
        _, next_value = self.actor_critic(next_states)
        returns = rewards + self.gamma * next_value * (1 - dones)
        values = self.actor_critic.critic(states)
        advantages = returns - values

        # compute the actor and critic losses
        actor_logits, _ = self.actor_critic(states)
        # exclude already fixed transformers from the actor distribution
        for tf in states_tf:
            if not tf.get_status:
                actor_logits[:, count] = float('-inf')
            count += 1
        dist = torch.distributions.Categorical(logits=actor_logits)
        log_probs = dist.log_prob(actions)
        actor_loss = -(log_probs * advantages.detach()).mean()
        critic_loss = advantages.pow(2).mean()

        # optimize the actor-critic network
        self.optimizer.zero_grad()
        (actor_loss + critic_loss).backward()
        self.optimizer.step()


def main():
    scaler = MinMaxScaler()
    transformer_source = np.array([
        [2400, 1, 0, 0, 2, 500, 53.532810, -113.503690],
        [4800, 1, 0, 0, 4, 1000, 53.544648, -113.490302],
        [7200, 0, 1, 0, 6, 0, 53.548889, -113.525556],
        [3200, 1, 0, 1, 1, 800, 53.524348, -113.527232],
        [5600, 1, 0, 1, 3, 2000, 53.552181, -113.491381],
    ])
    scaler.fit(transformer_source)
    normalized_source = scaler.transform(transformer_source)

    tf1 = Transformer(normalized_source[0])
    tf2 = Transformer(normalized_source[1])
    tf3 = Transformer(normalized_source[2])
    tf4 = Transformer(normalized_source[3])
    tf5 = Transformer(normalized_source[4])
    tfs = [tf1, tf2, tf3, tf4, tf5]

    env = Environment((5, tfs))

    # initialize the A2C agent
    a2c_agent = A2C(env)

    # set the number of training episodes
    num_episodes = 1000

    # define a list to store the rewards for each episode
    episode_rewards = []

    # start the training loop
    for episode in range(num_episodes):
        # reset the environment for a new episode
        state = env.reset()
        state_np = np.concatenate(np.array([tf.get_params() for tf in state]))
        state_np = np.reshape(state_np, (5, 6))

        # initialize the episode variables
        done = False
        episode_reward = 0
        t = 0
        episode_actions = []

        # run the episode
        while not done:
            # select an action using the A2C agent
            action = a2c_agent.select_action(state)

            # ignore actions for fixed transformers
            if not env.tf_list[action].get_status():
                continue

            episode_actions.append(action)
            # take the action in the environment
            next_state, reward, done = env.step(action)
            next_state_np = np.concatenate(
                np.array([tf.get_params() for tf in next_state]))
            next_state_np = np.reshape(state_np, (5, 6))

            # update the episode reward
            episode_reward += reward

            # add the transition to the rollout buffer
            env.add_transition(
                state, state_np, action, reward, next_state_np, done)

            # update the state for the next time step
            state = next_state
            state_np = np.concatenate(
                np.array([tf.get_params() for tf in state]))
            state_np = np.reshape(state_np, (5, 6))

            # increment the time step counter
            t += 1

            # update the agent's network if it's time to learn
            if (t + 1) % env.rollout_size - 1 == 0:
                a2c_agent.update(env.get_rollout())

        # store the episode reward
        episode_rewards.append(episode_reward)

        # print the results for this episode
        print(f"Episode {episode}: reward={episode_reward}")
        print(f"{episode_actions}")

    # plot the episode rewards
    plt.plot(episode_rewards)
    plt.show()


main()
