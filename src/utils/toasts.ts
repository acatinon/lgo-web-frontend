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

  if (jQuery("body").hasClass("dark")) {
    borderColor = "inverted " + borderColor;
  }

  jQuery("body").toast({
    showIcon: icon,
    class: borderColor,
    className: {
      toast: "ui floating message"
    },
    title: title,
    message: message
  });
}