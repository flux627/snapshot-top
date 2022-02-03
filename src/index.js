import fetch from 'node-fetch'
import {getChoices, getVotes} from "./queries.js";
import {findMaxIndices} from "./findMaxIndices.js";

const proposalId = process.argv[2];
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
