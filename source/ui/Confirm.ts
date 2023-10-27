export type Choice = "cancel" | "no" | "yes";
import styles from "./Confirm.module.css";

export class Confirm {
  static readonly CANCEL = "cancel";
  static readonly NO = "no";
  static readonly YES = "yes";

  static yesNo(question: string, parent: HTMLElement = document.body): Promise<Choice> {
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog");
      dialog.classList.add(styles.dialog);

      const label = document.createElement("div");
      label.textContent = question;
      dialog.appendChild(label);

      const choiceSection = document.createElement("div");
      choiceSection.classList.add(styles.choiceSection);
      dialog.appendChild(choiceSection);

      Confirm.#addYes(parent, dialog, choiceSection, resolve);
      Confirm.#addNo(parent, dialog, choiceSection, resolve);

      parent.appendChild(dialog);

      dialog.showModal();
    });
  }

  static yesNoCancel(question: string, parent: HTMLElement = document.body): Promise<Choice> {
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog");
      dialog.classList.add(styles.dialog);

      const label = document.createElement("div");
      label.textContent = question;
      dialog.appendChild(label);

      const choiceSection = document.createElement("div");
      choiceSection.classList.add(styles.choiceSection);
      dialog.appendChild(choiceSection);

      Confirm.#addYes(parent, dialog, choiceSection, resolve);
      Confirm.#addNo(parent, dialog, choiceSection, resolve);
      Confirm.#addCancel(parent, dialog, choiceSection, resolve);

      parent.appendChild(dialog);

      dialog.showModal();
    });
  }

  static #addCancel(
    parent: HTMLElement,
    dialog: HTMLDialogElement,
    section: HTMLElement,
    resolve: (choice: Choice) => void,
  ) {
    const button = document.createElement("button");
    button.textContent = "Cancel";
    button.addEventListener("click", () => {
      dialog.close();
      parent.removeChild(dialog);
      resolve(Confirm.CANCEL);
    });
    section.appendChild(button);
  }

  static #addNo(
    parent: HTMLElement,
    dialog: HTMLDialogElement,
    section: HTMLElement,
    resolve: (choice: Choice) => void,
  ) {
    const button = document.createElement("button");
    button.textContent = "No";
    button.addEventListener("click", () => {
      dialog.close();
      parent.removeChild(dialog);
      resolve(Confirm.NO);
    });
    section.appendChild(button);
  }

  static #addYes(
    parent: HTMLElement,
    dialog: HTMLDialogElement,
    section: HTMLElement,
    resolve: (choice: Choice) => void,
  ) {
    const button = document.createElement("button");
    button.textContent = "Yes";
    button.addEventListener("click", () => {
      dialog.close();
      parent.removeChild(dialog);
      resolve(Confirm.YES);
    });
    section.appendChild(button);
  }
}
