import { Environment } from "../../utils/environment";
import { cns, Level } from "../../utils/logger/cns";
import { getChoosePanel } from "./choosing";

export default {
  example: (env: Environment) => {
    cns.setCategories("choice");
    cns.setLevel(Level.Trace);

    const options = Array.from({ length: 3 }, (_, i) => ({
      title: `option ${i}`,
      content: `content of ${i}`,
      arg: i,
    }));

    const chooseWindow = getChoosePanel<number>(env);

    chooseWindow.showOptions(options);
  },
};
