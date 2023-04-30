import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# normalize input data and create expected output according to priorities
def norm_rank(data):
    scaler = MinMaxScaler()
    scaler.fit(data)
    normalized = scaler.transform(data)

    # Rank indices by cost fcn
    vals = []
    for d in normalized:
        # 0.2*POP + 0.5*KWH + 0.3*ELAPSED TIME
        vals.append(0.2*d[5] + 0.6*d[0] + 0.2*d[4])
    indices = np.argsort(vals)[::-1]

    # Prioritize ES
    ranked = []
    for i in indices:
        if data[i][3] == 1:
            ranked.append(i)

    # Add rest of cost ranked indices
    for i in indices:
        if i not in ranked:
            ranked.append(i)

    # Replace with normalized data
    data[:, 0] = normalized[:, 0]
    data[:, 4] = normalized[:, 4]
    data[:, 5] = normalized[:, 5]
    return data, np.array(ranked)

if __name__ == "__main__":
    # Load test data
    data = np.array(pd.read_csv('data/dndf_sim.csv', sep=',', header=None))
    SAMPLE_SIZE = 5
    
    for i in range(0, len(data), SAMPLE_SIZE):
        norm, rank_idxs = norm_rank(data[i:i+SAMPLE_SIZE])
        np.savetxt("data/x" + str(int(i/SAMPLE_SIZE)) + ".csv", norm, delimiter=",")
        np.savetxt("data/y" + str(int(i/SAMPLE_SIZE)) +".csv", rank_idxs, delimiter=",", fmt='%d')
