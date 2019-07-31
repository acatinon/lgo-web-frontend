export function addToast(title: string, message: string) {
    jQuery("body").toast({
        showIcon: "small green check",
        class: "",
        className: {
          toast: "ui floating message"
        },
        title: title,
        message: message
      });
}