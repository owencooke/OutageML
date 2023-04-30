import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import numpy as np
import pandas as pd

# Define a custom dataset to load the input and target data
class TransformerDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# Define the DNDF model
class DNDF(nn.Module):
    def __init__(self, num_trees, input_dim, hidden_dim, output_dim):
        super(DNDF, self).__init__()
        self.num_trees = num_trees
        self.trees = nn.ModuleList()
        for i in range(num_trees):
            tree = nn.Sequential(
                nn.Linear(input_dim, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, output_dim)
            )
            self.trees.append(tree)

    def forward(self, x):
        outputs = []
        for tree in self.trees:
            outputs.append(tree(x))
        return torch.stack(outputs, dim=1)

# Define the training function
def train(model, optimizer, criterion, dataloader, device):
    model.train()
    for x, y in dataloader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        outputs = model(x)
        outputs = outputs.view(-1, model.num_trees * model.trees[-1][-1].out_features)
        if y.shape[0] == 2:
            y = torch.stack([
                torch.tile(y[0], [10]),
                torch.tile(y[1], [10]),
            ])
        else:
            y = torch.tile(y[0], [1,10])
        loss = criterion(outputs, y.float())
        loss.backward()
        optimizer.step()

# Define the testing function
def test(model, criterion, dataloader, device):
    model.eval()
    total_loss = 0.0
    with torch.no_grad():
        for x, y in dataloader:
            x, y = x.to(device), y.to(device)
            outputs = model(x)
            outputs = outputs.view(-1, model.num_trees * model.trees[-1][-1].out_features)
            if y.shape[0] == 2:
                y = torch.stack([
                    torch.tile(y[0], [10]),
                    torch.tile(y[1], [10]),
                ])
            else:
                y = torch.tile(y[0], [1,10])
            loss = criterion(outputs, y.float())
            total_loss += loss.item() * x.size(0)
    return total_loss / len(dataloader.dataset)

if __name__ == "__main__":
    # Set the hyperparameters
    num_trees = 10
    input_dim = 6
    hidden_dim = 64
    output_dim = 1
    lr = 0.001
    batch_size = 2
    num_epochs = 600

    # Create the model, optimizer, and loss function
    model = DNDF(num_trees, input_dim, hidden_dim, output_dim)
    optimizer = optim.Adam(model.parameters(), lr=lr)
    criterion = nn.MSELoss()

    # Train the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    for epoch in range(num_epochs):
        for i in range(6):
            x = np.array(pd.read_csv('data/x' + str(i) + '.csv', sep=',', header=None))[:, 0:6]
            y = np.array(pd.read_csv('data/y' + str(i) + '.csv', sep=',', header=None)).flatten()
            # Create the dataset and dataloader
            dataset = TransformerDataset(x, y)
            dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
            train(model, optimizer, criterion, dataloader, device)

        loss = test(model, criterion, dataloader, device)
        print("Epoch: {} Loss: {:.4f}".format(epoch+1, loss))

    torch.save(model.state_dict(), 'models/dndf.pt')


    # # TEST ON NEW DATASET
    # X_new = np.array(pd.read_csv('data/x0.csv', sep=',', header=None))[:, 0:6]
    # new_dataset = TransformerDataset(X_new, [0, 1, 2, 3, 4])
    # new_dataloader = DataLoader(new_dataset, batch_size=1, shuffle=False)

    # # Evaluate the model on the new dataset
    # model.eval()
    # with torch.no_grad():
    #     rankings = []
    #     for x, _ in new_dataloader:
    #         x = x.to(device)
    #         outputs = model(x)
    #         rankings.append(outputs.mean().item())

    # # Return the ranked (CALL TO API)
    # indices = np.argsort(np.array(rankings))
    # ranked = X_new[indices]
    # np.savetxt("out.csv", ranked, delimiter=",")

