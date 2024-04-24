import { button, checkbox, label, textbox, window } from "openrct2-flexui";

let originalGuestMaximum: number = 0;
let suggestedGuestMaximum: number = 0;
let activate: boolean = false;
let event: any;

export const allWidgets = window({
  title: "OpenRCT2 Soft Guest Cap Editor",
  width: { value: 200, min: 200, max: 10_000 },
  height: { value: 117, min: 117, max: 10_000 },
  onUpdate() {
    originalGuestMaximum = park.suggestedGuestMaximum;
  },
  content: [
    label({
      alignment: "centred",
      text: `Original Guest Cap: ${originalGuestMaximum.toString()}`,
      tooltip:
        "This is the maximum number of guests that will be allowed in your park",
    }),
    label({
      alignment: "centred",
      text: "Enter your desired soft guest cap",
      tooltip:
        "This is the maximum number of guests that will be allowed in your park",
    }),
    textbox({
      text: suggestedGuestMaximum.toString(),
      onChange: (text: string) => {
        // @ts-ignore
        suggestedGuestMaximum = Number.parseInt(text);
      },
    }),
    checkbox({
      text: "Active custom soft guest cap",
      isChecked: activate,
      onChange: function (checked) {
        activate = checked;
        if (checked) {
          event = context.subscribe("park.calculateGuestCap", (e) => {
            originalGuestMaximum = e.suggestedGuestMaximum;
            e.suggestedGuestMaximum = suggestedGuestMaximum;
          });
        } else if (event) {
          event.dispose();
          event = null;
        }
      },
    }),
    button({
      text: "Current Guest Cap",
      onClick: () => {
        park.postMessage(
          `Your current soft guest cap is ${park.suggestedGuestMaximum}`
        );
      },
      height: "23px",
    }),
  ],
});

export function main() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Soft Guest Cap Editor";
    ui.registerMenuItem(menuItemName, function () {
      originalGuestMaximum = park.suggestedGuestMaximum;
      allWidgets.open();
    });
  }
}
