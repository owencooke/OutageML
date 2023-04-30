import torch
from torch.utils.data import DataLoader
import numpy as np
import pandas as pd
from train_dndf import DNDF, TransformerDataset

'''
LOADS PRE-TRAINED MODEL AND OUTPUTS RANKED DATA API
'''

# Create a new dataset with input data
X = np.array(pd.read_csv('data/x0.csv', sep=',', header=None))
inputs = X[:, 0:6]
new_dataset = TransformerDataset(inputs, [0]*len(inputs))
new_dataloader = DataLoader(new_dataset, batch_size=1, shuffle=False)

# Evaluate the model on the new dataset
model = DNDF(num_trees=10, input_dim=6, hidden_dim=64, output_dim=1)
model.load_state_dict(torch.load('models/dndf.pt'))
model.eval()
with torch.no_grad():
    rankings = []
    for x, _ in new_dataloader:
        outputs = model(x)
        rankings.append(outputs.mean().item())

# Rank the original data
indices = np.argsort(np.array(rankings))
ranked = X[indices]

# CREATE RANKED DATA FOR API
data = []
for idx, tf in enumerate(ranked):
    d = {}
    d["coordinates"] = [tf[-2], tf[-1]]
    d["priorityRanking"] = idx+1
    d["timeElapsed"] = tf[4]
    d["resolved"] = False
    data.append(d)

# DUMP JSON
# import json
# print(json.dumps(data, indent=2))

# DUMP NUMPY RANKED ARRAY
# np.savetxt("out.csv", ranked, delimiter=",")
