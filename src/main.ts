import {
  WritableStore,
  store,
  button,
  checkbox,
  label,
  textbox,
  window,
} from "openrct2-flexui";

let SuggestedMaxGuests: WritableStore<number> = store(0);
let CurrentGuestMaximum: WritableStore<number> = store(
  park.suggestedGuestMaximum,
);
let Activate: WritableStore<boolean> = store(false);
let Event: any;

export const MainWindow = window({
  title: "Soft Guest Cap Editor",
  width: { value: 300, min: 300, max: 350 },
  height: { value: 100, min: 100, max: 110 },
  content: [
    label({
      alignment: "centred",
      text: `Enter your desired soft guest cap`,
      tooltip:
        "This is the maximum number of guests that will be allowed in your park",
    }),
    textbox({
      text: CurrentGuestMaximum.get().toString(),
      onChange: (text: string) => {
        SuggestedMaxGuests.set(Number(text));
      },
    }),
    checkbox({
      text: "Activate custom soft guest cap",
      isChecked: Activate.get(),
      onChange: function (checked) {
        Activate.set(checked);
        if (checked) {
          Event = context.subscribe("park.guest.softcap.calculate", (e) => {
            e.suggestedGuestMaximum = SuggestedMaxGuests.get();
            CurrentGuestMaximum.set(SuggestedMaxGuests.get());
          });
        } else if (Event) {
          Event.dispose();
          Event = null;
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
    ui.registerMenuItem(menuItemName, () => MainWindow.open());
  }
}
