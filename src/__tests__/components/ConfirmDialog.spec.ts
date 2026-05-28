import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

describe("ConfirmDialog", () => {
  it("renders the message", () => {
    const w = mount(ConfirmDialog, {
      props: { open: true, message: "Delete?" },
    });
    expect(w.text()).toContain("Delete?");
  });

  it("emits confirm on confirm button click", async () => {
    const w = mount(ConfirmDialog, { props: { open: true, message: "Sure?" } });
    await w.find('[data-testid="confirm-btn"]').trigger("click");
    expect(w.emitted("confirm")).toBeTruthy();
  });

  it("emits cancel on cancel button click", async () => {
    const w = mount(ConfirmDialog, { props: { open: true, message: "Sure?" } });
    await w.find('[data-testid="cancel-btn"]').trigger("click");
    expect(w.emitted("cancel")).toBeTruthy();
  });

  it("shows custom confirmLabel", () => {
    const w = mount(ConfirmDialog, {
      props: { open: true, message: "Sure?", confirmLabel: "Remove" },
    });
    expect(w.find('[data-testid="confirm-btn"]').text()).toBe("Remove");
  });
});
