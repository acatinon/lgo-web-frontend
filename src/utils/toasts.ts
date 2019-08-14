export function addToast(title: string, message: string, icon: string) {
    jQuery("body").toast({
        showIcon: icon,
        class: "",
        className: {
          toast: "ui floating message"
        },
        title: title,
        message: message
      });
}