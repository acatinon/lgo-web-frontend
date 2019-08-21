export enum MessageType {
  Success,
  Warning,
  Error
}

export function addToast(title: string, message: string, type: MessageType) {
  let icon;
  let borderColor;

  switch (type) {
    case MessageType.Success:
      icon = "small green check";
      borderColor = "green";
      break;
    case MessageType.Warning:
      icon = "small orange exclamation";
      borderColor = "orange";
      break;
    case MessageType.Error:
      icon = "small red exclamation";
      borderColor = "red";
      break;
  }

  jQuery("body").toast({
    showIcon: icon,
    displayTime: 50000,
    class: jQuery("body").hasClass("dark") ? "inverted green" : "green",
    className: {
      toast: "ui floating message"
    },
    title: title,
    message: message
  });
}