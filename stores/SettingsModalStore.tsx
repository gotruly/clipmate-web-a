import { atom, useAtom } from "jotai";

const SettingAtom = atom<boolean>(false);
const SettingsTabAtom = atom<string>("account");

const useSettingsModalAtom = () => {
  const [open, setOpen] = useAtom(SettingAtom);
  const [tab, setTab] = useAtom(SettingsTabAtom);

  return { open, setOpen, tab, setTab };
};

export default useSettingsModalAtom;
