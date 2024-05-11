import { FormModalUiHandler } from "./form-modal-ui-handler";
import { ModalConfig } from "./modal-ui-handler";
import * as Utils from "../utils";
import { Mode } from "./ui";
import i18next from '../plugins/i18n';

export default class AddFriendFormUiHandler extends FormModalUiHandler {
  getModalTitle(config?: ModalConfig): string {
    return i18next.t('menu:addFriend');
  }

  getFields(config?: ModalConfig): string[] {
    return [ i18next.t('menu:username') ];
  }

  getWidth(config?: ModalConfig): number {
    return 160;
  }

  getMargin(config?: ModalConfig): [number, number, number, number] {
    return [ 0, 0, 48, 0 ];
  }

  getButtonLabels(config?: ModalConfig): string[] {
    return [ i18next.t('menu:add') ];
  }

  getReadableErrorMessage(error: string): string {
    let colonIndex = error?.indexOf(':');
    if (colonIndex > 0)
      error = error.slice(0, colonIndex);
    switch (error) {
      case 'user not found':
        return i18next.t('menu:userNotFound');
    }

    return super.getReadableErrorMessage(error);
  }

  show(args: any[]): boolean {
    if (super.show(args)) {
      const config = args[0] as ModalConfig;

      const originalLoginAction = this.submitAction;
      this.submitAction = (_) => {
        this.submitAction = originalLoginAction;
        this.scene.ui.setMode(Mode.LOADING, { buttonActions: [] });
        console.log("Trying to add ", this.inputs[0].text);
        Utils.apiPost(`account/addfriend`, `username=${encodeURIComponent(this.inputs[0].text)}`, 'application/x-www-form-urlencoded', true)
          .then(response => {
            if (!response.ok)
              return response.text();
            return response.json();
          })
          .then(response => {
            console.log(response)
          });
        this.inputs[0].text = "";
        originalLoginAction()

        // this.scene.ui.setMode(Mode.ADD_FRIEND_FORM, Object.assign(config, { errorMessage: i18next.t('menu:addedFriend') + this.inputs[0].text }));
        // this.scene.ui.playError();
      };

      return true;
    }

    return false;
  }
}