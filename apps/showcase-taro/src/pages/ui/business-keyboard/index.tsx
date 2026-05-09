import { ScrollView } from "@tarojs/components";
import { BusinessKeyboardDemo } from "../../../showcase/business-keyboard-demo";
import { DetailShell } from "../../../showcase/detail-shell";

export default function BusinessKeyboardPage() {
  return (
    <ScrollView scrollY>
      <DetailShell
        eyebrow="UI Components"
        summary="体验业务键盘的按键布局、事件回调、禁用态和不同紧凑度。"
        title="BusinessKeyboard"
      >
        <BusinessKeyboardDemo />
      </DetailShell>
    </ScrollView>
  );
}
