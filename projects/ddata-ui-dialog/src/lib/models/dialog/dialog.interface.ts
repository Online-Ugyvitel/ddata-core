export interface DialogUIFieldsInterface {
  ok_button_text: string;
  cancel_button_text: string;
  close_button_text: string;
}

export type DialogType = 'message' | 'delete' | 'warning' | string;
