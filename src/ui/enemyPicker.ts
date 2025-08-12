import { Pane, FolderApi, TabPageApi, ListBladeApi } from "tweakpane";
import { EnemyManager } from "../gameobjects/enemy/enemyManager";

type Parent = Pane | FolderApi | TabPageApi;

export function addEnemyPicker(pane: Parent, manager: EnemyManager) {
  const folder = pane.addFolder({
    title: "enemy details",
  });

  type Option = { text: string; value: string };

  const getMeta = () => {
    const keys = Array.from(manager.utils.pool.keys());
    const types: Option[] = (() => {
      const _types = Array.from(new Set(keys.map((arr) => arr[0])));
      _types.sort();
      return _types.map((t) => ({ text: t, value: t }));
    })();

    //keys.map(arr => ({text: arr[0], value: arr[0]}))
    const ids: Option[] = keys.map((arr) => ({
      text: arr[1].toString(),
      value: arr[1].toString(),
    }));

    return {
      types,
      ids,
    };
  };

  const noneOption: Option = { text: "none", value: "none" };

  const params = {
    typeOptions: [noneOption],
    selectedType: noneOption.value, //manager.utils.pool.keys().next().value!,
    idOptions: [noneOption],
    selectedId: noneOption.value,
  };
  const typeSelector = pane.addBlade({
    view: "list",
    label: "enemyType",
    options: params.typeOptions,
    value: noneOption.value,
  }) as ListBladeApi<string>;

  const idSelector = pane.addBlade({
    view: "list",
    label: "id",
    options: [noneOption],
    value: noneOption.value,
  }) as ListBladeApi<string>;

  const handleUpdate = () => {
    const meta = getMeta();
    params.typeOptions = [noneOption].concat(meta.types);
    params.idOptions = [noneOption].concat(meta.ids);

    typeSelector.options = params.typeOptions;
    idSelector.options = params.idOptions;
  };
  manager.utils.pool.added.connect(handleUpdate);
  manager.utils.pool.deleted.connect(handleUpdate);
  manager.utils.pool.updated.connect(handleUpdate);

  // const selector = pane.addBlade({
  //     view: 'list',
  //     label: 'enemies',
  //     options: params.options,
  //     value: params.value
  // }) as ListBladeApi<string>

  // selector.on('change', ev => {
  //     console.log(ev.value)
  //     params.value = ev.value
  // })

  return folder;
}
