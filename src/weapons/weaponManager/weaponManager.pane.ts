import { ListBladeApi } from "tweakpane";
import { Parent } from "../../paneDefinitions";
import { Weapon, WeaponManager } from "./weaponManager";
import { HolyBible, Lightning, Sword } from "../definitions";
import { addVar } from "../../ui/paneUtils";

export function addWeaponManagerPane(
  pane: Parent,
  manager: WeaponManager,
): void {
  const folder = pane.addFolder({ title: "weapon manager" });

  const getOptions = (arr: Weapon["kind"][]) => {
    const opts = arr.map((name) => ({ text: String(name), value: name }));
    return opts;
  };

  const weaponList: Weapon["kind"][] = ["sword", "holyBible", "lightning"];

  const params = {
    names: weaponList,
    selectedToAdd: weaponList[0],
  };

  const selectWeapon = folder.addBlade({
    view: "list",
    label: "select weapon",
    options: getOptions(params.names),
    value: "none",
  }) as ListBladeApi<Weapon["kind"]>;
  selectWeapon.on("change", (ev) => (params.selectedToAdd = ev.value));

  const handleNewWeapon = (kind: Weapon["kind"]) => {
    params.names = params.names.filter((name) => name !== kind);
    selectWeapon.options = getOptions(params.names);

    switch (kind) {
      case "sword": {
        addSwordPane(folder, manager.weapons.sword, manager.upgrade);
        break;
      }
      case "holyBible": {
        addHolyBiblePane(folder, manager.weapons.holyBible, manager.upgrade);
        break;
      }
      case "lightning": {
        addLightningPane(folder, manager.weapons.lightning, manager.upgrade);
        break;
      }
    }
  };
  manager.added.connect(handleNewWeapon);

  const addButton = folder.addButton({
    title: "add",
  });
  addButton.on("click", () => {
    console.log("click", params.selectedToAdd, params.names);
    if (params.names.includes(params.selectedToAdd)) {
      manager.addWeapon(params.selectedToAdd as Weapon["kind"]);
    }
  });

  const openChoicePanelButton = folder.addButton({ title: "open choice" });
  openChoicePanelButton.on("click", () => manager.showWeaponSelection());
}

// instead link to sword should be getter
function addSwordPane(
  pane: Parent,
  getSword: () => Sword,
  upgradeFn: (kind: Weapon["kind"]) => void,
) {
  const folder = pane.addFolder({ title: "sword" });
  const sword = getSword()!;
  addVar(folder, sword.isOn.signal, "isOn", sword.isOn.get());
  const btn = folder.addButton({ title: "upgrade" });
  btn.on("click", () => upgradeFn("sword"));
}

function addHolyBiblePane(
  pane: Parent,
  getWeapon: () => HolyBible,
  upgradeFn: (kind: Weapon["kind"]) => void,
) {
  const folder = pane.addFolder({ title: "holy bible" });
  const weapon = getWeapon();
  addVar(folder, weapon.isOn.signal, "isOn", weapon.isOn.get());
  const btn = folder.addButton({ title: "upgrade" });
  btn.on("click", () => upgradeFn("holyBible"));
}

function addLightningPane(
  pane: Parent,
  getWeapon: () => Lightning,
  upgradeFn: (kind: Weapon["kind"]) => void,
) {
  const folder = pane.addFolder({ title: "lightning" });
  const weapon = getWeapon();
  addVar(folder, weapon.isOn.signal, "isOn", weapon.isOn.get());
  const btn = folder.addButton({ title: "upgrade" });
  btn.on("click", () => upgradeFn("lightning"));
}
