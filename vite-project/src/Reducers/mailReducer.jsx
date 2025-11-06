export const initialMailState = {
  mails: [],
  unreadCount: 0,
  selectedMail: null,
};

export const mailReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAILS":
      const unread = action.payload.filter((mail) => !mail.read).length;
      return { ...state, mails: action.payload, unreadCount: unread };

    case "MARK_AS_READ":
      const updatedMails = state.mails.map((mail) =>
        mail.id === action.payload ? { ...mail, read: true } : mail
      );
      return {
        ...state,
        mails: updatedMails,
        unreadCount: updatedMails.filter((m) => !m.read).length,
      };

    case "SELECT_MAIL":
      return { ...state, selectedMail: action.payload };

    default:
      return state;
  }
};
