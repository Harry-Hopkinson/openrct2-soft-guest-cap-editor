import { button, label, textbox, window } from "openrct2-flexui";

var text = park.suggestedGuestMaximum;
var naturalGuestCap = true;

export const allWidgets = window({
  title: "OpenRCT2 Soft Guest Cap Editor",
  width: { value: 200, min: 75, max: 10_000 },
  height: { value: 120, min: 90, max: 10_000 },
  content: [
    label({
      alignment: "centred",
      text: "Enter the guest cap, Current " + text,
    }),
    textbox({
      onChange: (text: string) => {
        naturalGuestCap = false;
        handleGuestCap(text);
      },
    }),
    button({
      text: "Submit guess cap",
      height: "28px",
    }),
    button({
      text: "Natural Guest Cap",
      height: "28px",
      onClick: () => {
        naturalGuestCap = true;
        text = park.suggestedGuestMaximum;
      },
    }),
  ],
});

function handleGuestCap(text: string) {
  var suggestedCap = park.suggestedGuestMaximum;
  var cap = Number(text);
  if (
    scenario.objective.type === "guestsBy" ||
    scenario.objective.type === "guestsAndRating"
  ) {
    cap = Math.floor((100 * suggestedCap) / scenario.objective.guests);
  }
  text = cap.toString();
  park.suggestedGuestMaximum = cap;
}

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Soft Guest Cap Editor";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
    context.subscribe("guest.generation", function () {
      if (!naturalGuestCap) {
        handleGuestCap(park.suggestedGuestMaximum.toString());
      } else {
        text = park.suggestedGuestMaximum;
      }
    });
  }
}
