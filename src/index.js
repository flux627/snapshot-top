import fetch from 'node-fetch'
import {getChoices, getVotes} from "./queries.js";
import {findMaxIndices} from "./findMaxIndices.js";

const proposalId = process.argv[2] || '0xa0220651df3d1e501f211f02bd81f3e00e2d182086a8b4cec5eee5595eb6bb5e';
const topCount = process.argv[3] || 7;

(async () => {
  const choices = await getChoices(proposalId)
  const votes = await getVotes(proposalId)
  const totals = Array(choices.length).fill(0)
  for (const vote of votes) {
    for (const choice of vote.choice) {
      totals[choice - 1] += vote.vp
    }
  }
  const maxIndices = findMaxIndices(totals, topCount)
  for (const index of maxIndices) {
    console.log(`${totals[index]}: ${choices[index]}`)
  }
})()
