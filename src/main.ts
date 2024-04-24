import {
  button,
  label,
  textbox,
  window,
  store,
  checkbox,
  Bindable,
  ElementVisibility,
} from "openrct2-flexui";

let suggestedGuestMaximum = store("");
let setGuestCap: Bindable<ElementVisibility> = "hidden";

export const allWidgets = window({
  title: "OpenRCT2 Soft Guest Cap Editor",
  width: { value: 200, min: 200, max: 10_000 },
  height: { value: 90, min: 120, max: 10_000 },
  content: [
    label({
      alignment: "centred",
      text: "Enter your desired soft guest cap",
    }),
    textbox({
      onChange: (text: string) => {
        suggestedGuestMaximum.set(text);
      },
      visibility: setGuestCap,
    }),
    checkbox({
      text: "Set Guest Cap",
      onChange: (checked) => {
        setGuestCap = checked ? "visible" : "hidden";
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

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Soft Guest Cap Editor";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
    context.subscribe("park.calculateGuestCap", (e) => {
      e.suggestedGuestMaximum = Number(suggestedGuestMaximum.get());
    });
  }
}
