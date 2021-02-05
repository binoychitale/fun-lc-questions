/*
  I found this question on Leetcode - https://leetcode.com/problems/critical-connections-in-a-network
  This solution uses a modified Trajan's algorithm to identify links between strongly connected groups
  The modification to the stock algorithm is needed to take care of a non-directed graph
*/

/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number[][]}
 */


var Node = function(index) {
    this.nb = [];
    this.index = index;
};

var criticalConnections = function(n, connections) {

    let nodes = new Array(n);
    
    for (let i = 0; i < connections.length; i++) { 
        let a = connections[i][0];
        let b = connections[i][1];
        let nodeA = nodes[a] || new Node(a);
        let nodeB = nodes[b] || new Node(b);
        nodeA.nb.push(b);
        nodeB.nb.push(a);
        nodes[a] = nodeA;
        nodes[b] = nodeB;
    }
    return getCriticalPaths(nodes);
};

function getCriticalPaths(nodes) {
    let visited = new Set();
    let discovery = {};
    let low = {};
    let result = [];
    let tree = [];
    search(0, nodes, visited, discovery, low, result, 0, tree);
    
    return result;
}

function search(curr, nodes, visited, discovery, low, result, ts, tree) {
    visited.add(curr);
    discovery[curr] = ts;
    tree.push(curr);
    low[curr] = ts;
    for(let i = 0; i < nodes[curr].nb.length; i++) {
        let index = nodes[curr].nb[i];
        if (!visited.has(index)) {
            let l = search(index, nodes, visited, discovery, low, result, ts + 1, tree);
            if (low[index] === discovery[index]) {
                result.push([curr, index]);
            }
            low[curr] = Math.min(low[curr], l);
            continue;
        }
        if (tree.includes(index) && tree[tree.findIndex((val) => val === index) + 1] !== curr) {
            let disc = discovery[index];
            low[curr] = Math.min(low[curr], disc);
        }
    }
    tree.pop();
    return low[curr];
}
