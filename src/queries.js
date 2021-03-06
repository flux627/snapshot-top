import fetch from "node-fetch"

export async function getVotes(proposalId) {
  const response = await fetch('https://hub.snapshot.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"operationName":"Votes","variables":{"id":"${proposalId}","orderBy":"vp","orderDirection":"desc","first":30000},"query":"query Votes($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: OrderDirection, $voter: String) {\\n  votes(\\n    first: $first\\n    skip: $skip\\n    where: {proposal: $id, vp_gt: 0, voter: $voter}\\n    orderBy: $orderBy\\n    orderDirection: $orderDirection\\n  ) {\\n    id\\n    ipfs\\n    voter\\n    created\\n    choice\\n    vp\\n    vp_by_strategy\\n  }\\n}"}`,
  })

  return JSON.parse(await response.text()).data.votes
}

export async function getProposal(proposalId) {
  const response = await fetch('https://hub.snapshot.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"operationName":"Proposal","variables":{"id":"${proposalId}"},"query":"query Proposal($id: String!) {\\n  proposal(id: $id) {\\n    id\\n    ipfs\\n    title\\n    body\\n    choices\\n    start\\n    end\\n    snapshot\\n    state\\n    author\\n    created\\n    plugins\\n    network\\n    type\\n    strategies {\\n      name\\n      params\\n    }\\n    space {\\n      id\\n      name\\n    }\\n    scores_state\\n    scores\\n    scores_by_strategy\\n    scores_total\\n    votes\\n  }\\n}"}`,
  })

  return JSON.parse(await response.text()).data.proposal
}

export async function getChoices(proposalId) {
  return (await getProposal(proposalId)).choices
}

export async function getVotingPowers(proposalId) {
  const proposal = await getProposal(proposalId)
  const votes = await getVotes(proposalId)
  const voteAddresses = votes.map((vote) => vote.voter)
  const response = await fetch('https://score.snapshot.org/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      params: {
        space: proposal.space.id,
        network: proposal.network,
        snapshot: parseInt(proposal.snapshot),
        strategies: proposal.strategies,
        addresses: voteAddresses,
      }
    })
  })

  return (await response.json()).result.scores[0]
}
