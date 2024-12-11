export const constants = {
  messageError: {
    UserAlreadyUnderAssessment: "User is already under assessment.",
    UserAlreadyBanned: "User is already banned.",
    UserAlreadyReported: "User has already been reported.",
    InvalidQuorumValue: "Invalid quorum value.",
    AmountBelowMinimumParticipation:
      "Amount below minimum participation requirement.",
    WithdrawalCannotBeZero: "Withdrawal amount cannot be zero.",
    InsufficientParticipation:
      "Insufficient participation for this withdrawal.",
    WithdrawalNotAuthorizedYet: "Withdrawal not authorized yet.",
    NotEnoughReports:
      "User must be reported at least 10 times to be under assessment.",
    NotActiveParticipant: "Participant is not active.",
    UserRecentlyReestablished:
      "User has been recently reestablished and is in grace period.",
    UnknownState: "Unknown voting state.",
    AlreadyVoted: "You have already voted in this assessment.",
    InactiveParticipant: "Inactive participant.",
    VotingNotActive: "Voting is not active for this assessment.",
    AlreadyExecuted: "This assessment has already been executed.",
    InvalidAssessmentState: "Assessment state is invalid for execution.",
    default: "Unknown error",
  },
};
