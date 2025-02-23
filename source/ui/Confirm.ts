import styles from "./Confirm.module.css";

/**
 * The choices you can make in a confirmation.
 */
export type Choice = "cancel" | "no" | "yes";

/**
 * A confirmation dialog.
 */

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Confirm {
  /**
   * Show a yes/no confirmation dialog.
   * @param question - The question to ask.
   * @param parent - The element that should host the dialog.
   * @returns The user's choice.
   */
  static yesNo(question: string, parent: HTMLElement = document.body): Promise<Choice> {
    return new Promise((resolve, _reject) => {
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

  /**
   * Show a yes/no/cancel confirmation dialog.
   * @param question - The question to ask.
   * @param parent - The element that should host the dialog.
   * @returns The user's choice.
   */
  static yesNoCancel(question: string, parent: HTMLElement = document.body): Promise<Choice> {
    return new Promise((resolve, _reject) => {
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
      resolve("cancel");
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
      resolve("no");
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
      resolve("yes");
    });
    section.appendChild(button);
  }
}
