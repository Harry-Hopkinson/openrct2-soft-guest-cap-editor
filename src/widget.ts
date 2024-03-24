import { button, label, textbox, window } from "openrct2-flexui";

var text = park.suggestedGuestMaximum;

export const allWidgets = window({
  title: "OpenRCT2 Soft Guest Cap Editor",
  width: { value: 200, min: 75, max: 10_000 },
  height: { value: 90, min: 75, max: 10_000 },
  content: [
    label({
      alignment: "centred",
      text: "Enter the guest cap, Current " + text,
    }),
    textbox({
      onChange: (text: string) => handleGuestCap(text),
    }),
    button({
      text: "Submit guess cap",
      height: "28px",
      onClick: () => {
        console.log("Suggested cap is now", park.suggestedGuestMaximum);
      },
    }),
  ],
});

export function displayGuestCap() {
  context.subscribe("interval.day", function () {
    text = park.suggestedGuestMaximum;
  });
}

function handleGuestCap(text: string) {
  var suggestedCap = park.suggestedGuestMaximum;
  var cap = Number(text);
  if (
    scenario.objective.type === "guestsBy" ||
    scenario.objective.type === "guestsAndRating"
  ) {
    cap = Math.floor((100 * suggestedCap) / scenario.objective.guests);
  }
  park.suggestedGuestMaximum = cap;
}
