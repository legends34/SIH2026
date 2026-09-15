export const queue = {
  title: 'My token',
  nowServing: 'Now Serving',
  yourToken: 'Your Token',
  etaLabel: 'Estimated Wait Time',
  liveTracking: 'Live Queue Status',
  tokenNumber: 'Token {number}',
  currentToken: 'Now serving: {number}',
  estimatedWait: 'About {minutes} minutes wait',
  yourTurn: 'It is your turn. Please go to {room}.',
  missed: 'Your token was skipped. Ask at the desk to rejoin.',
  done: 'Your visit is done.',
  cancel: {
    button: 'Cancel token',
    confirm: 'Cancel your token and leave the queue?',
    success: 'Token cancelled.',
  },
  empty: 'You do not have an active token.',
} as const;
