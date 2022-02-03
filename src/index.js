import {getChoices, getVotes, getVotingPowers} from "./queries.js"
import {findMaxIndices} from "./findMaxIndices.js"

const proposalId = process.argv[2] || '0xbef622be197b4b238d034e41b95c7c3906a7882d9c807c6e8c4841859bcf0e6d'
const topCount = process.argv[3] || 7;

(async () => {
  const choices = await getChoices(proposalId)
  const votes = await getVotes(proposalId)
  const votingPowers = await getVotingPowers(proposalId, votes) // used before votes finalized
  const totals = Array(choices.length).fill(0)
  for (const vote of votes) {
    for (let i = 0; i < vote.choice.length || i < topCount; i++) {
      if (vote.vp === 0) {
        vote.vp = votingPowers[vote.voter]
      }
      totals[vote.choice[i] - 1] += vote.vp
    }
  }
  const maxIndices = findMaxIndices(totals, topCount)
  for (const index of maxIndices) {
    console.log(`${totals[index]}: ${choices[index]}`)
  }
})()
