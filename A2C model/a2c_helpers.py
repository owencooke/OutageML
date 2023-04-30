import numpy as np


class Transformer():
    def __init__(self, params):
        self.params = params[0:6]
        self.coords = params[6:]
        self.broken = True

    def get_coords(self):
        return self.coords

    def get_params(self):
        return self.params

    def get_status(self):
        return self.broken

    def update_time(self, time):
        self.params[4] += time

    def fix_transformer(self):
        self.broken = False

    # Might not be necessary
    def break_transformer(self):
        self.broken = True


class Environment():
    def __init__(self, tfs_tuple: tuple[int, list]):
        self.tfs_tuple = tfs_tuple
        self.num_tfs = tfs_tuple[0]
        self.tf_list = tfs_tuple[1]
        self.tf_init_list = tfs_tuple[1]
        self.rollout = ([], [], [], [], [], [])
        self.rollout_size = len(self.rollout)

    def reset(self):
        self.rollout = ([], [], [], [], [], [])
        self.tf_list = self.tf_init_list
        for tf in self.tf_list:
            tf.break_transformer()
        return self.tf_init_list

    def add_transition(self, state, state_np, action, reward, next_state_np, done):
        self.rollout[0].append(state)
        self.rollout[1].append(state_np)
        self.rollout[2].append(action)
        self.rollout[3].append(reward)
        self.rollout[4].append(next_state_np)
        self.rollout[5].append(done)
        self.rollout_size = len(self.rollout)

    def get_rollout(self):
        temp_rollout = self.rollout
        self.rollout = ([], [], [], [], [], [])
        return temp_rollout

    def step(self, action):
        done = True

        # Access transformer for action
        my_tf = self.tf_list[action]

        # Get values of chosen action
        params = my_tf.get_params()

        # Cost function that weighs the inputs of chosen value
        if params[3] == 0:
            reward = 0.2*params[5] + 0.6*params[0] + 0.1*params[4]
        else:
            reward = 1.0

        # Function to fix transformer & check if they are all filled
        my_tf.fix_transformer()
        for tf in self.tf_list:
            if tf.get_status():
                done = False
                tf.update_time(0.5)

        return self.tf_list, reward, done
