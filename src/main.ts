import {
  WritableStore,
  store,
  button,
  checkbox,
  label,
  textbox,
  window,
} from "openrct2-flexui";

let suggestedGuestMaximum: number = 0;
let currentGuestMaximum: WritableStore<number> = store(
  park.suggestedGuestMaximum,
);
let activate: boolean = false;
let event: any;

export const allWidgets = window({
  title: "OpenRCT2 Soft Guest Cap Editor",
  width: { value: 300, min: 300, max: 350 },
  height: { value: 100, min: 100, max: 110 },
  content: [
    label({
      alignment: "centred",
      text: `Enter your desired soft guest cap - Current: ${currentGuestMaximum.get()}`,
      tooltip:
        "This is the maximum number of guests that will be allowed in your park",
    }),
    textbox({
      text: currentGuestMaximum.get().toString(),
      onChange: (text: string) => {
        suggestedGuestMaximum = Number(text);
      },
    }),
    checkbox({
      text: "Activate custom soft guest cap",
      isChecked: activate,
      onChange: function (checked) {
        activate = checked;
        if (checked) {
          event = context.subscribe("park.guest.softcap.calculate", (e) => {
            e.suggestedGuestMaximum = suggestedGuestMaximum;
            currentGuestMaximum.set(suggestedGuestMaximum);
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
          `Your current soft guest cap is ${park.suggestedGuestMaximum}`,
        );
      },
      height: "23px",
    }),
  ],
});

export function main() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Soft Guest Cap Editor";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
  }
}
