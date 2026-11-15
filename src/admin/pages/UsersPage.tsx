import { useRef, useState } from "react";
import { apiDelete, apiPost, apiPut, useApi } from "../../api";
import { ActionButtons } from "../components/ActionButtons";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { DottedCard } from "../components/Shell";
import { Field } from "../components/Field";
import { Modal } from "../components/Modal";
import { collectFields, useAction } from "../lib/helpers";

type UserRow = { id: number; name: string; email: string };

export function UsersPage({ notify }: { notify: () => void }) {
  const { data, loading, error, reload } = useApi<UserRow[]>("/users", []);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { error: aErr, run } = useAction(notify);

  const save = () => {
    const f = collectFields(modalRef.current);
    const isEdit = editing && editing.id > 0;

    const payload: Record<string, string | number> = {
      name: f["Full Name"] ?? "",
      email: f["Email Address"] ?? "",
    };

    if (isEdit) {
      const oldPassword = f["Old Password"] ?? "";
      const newPassword = f["New Password"] ?? "";
      if (oldPassword) payload.oldPassword = oldPassword;
      if (newPassword) payload.password = newPassword;
    } else {
      const password = f["Password"] ?? "";
      if (password) payload.password = password;
    }

    const p = isEdit
      ? apiPut(`/users/${editing.id}`, payload)
      : apiPost("/users", payload);

    run(p, reload)
      .then(() => setEditing(null))
      .catch(() => {
        /* banner shows the error */
      });
  };

  const remove = (id: number) => {
    if (id > 0 && window.confirm("Delete this user?")) {
      run(apiDelete(`/users/${id}`), reload);
    }
  };

  const rows = data.map((user, i) => ({
    name: user.name,
    email: user.email,
    actions: (
      <ActionButtons
        tealEdit
        onlyEdit={i === 0}
        onEdit={() => setEditing(user)}
        onDelete={() => remove(user.id)}
      />
    ),
  }));

  const state = rows.length
    ? undefined
    : loading
    ? { kind: "loading" as const }
    : error
    ? { kind: "error" as const, text: error }
    : { kind: "empty" as const, text: "No users yet." };

  const isEdit = editing && editing.id > 0;

  return (
    <DottedCard className="users-card">
      {aErr && <div className="banner banner--error">{aErr}</div>}
      <div className="card-action">
        <Button
          tone="teal"
          icon="plus"
          onClick={() => setEditing({ id: -1, name: "", email: "" })}
        >
          Add User
        </Button>
      </div>

      <DataTable
        controls={false}
        sortable={false}
        footer={false}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "actions", label: "Actions" },
        ]}
        rows={rows}
        state={state}
      />

      {editing && (
        <Modal
          title={isEdit ? "Edit User" : "Add New User"}
          onClose={() => setEditing(null)}
          footer={null}
        >
          <div className="modal-form" ref={modalRef}>
            <Field label="Full Name" value={editing.name} />
            <Field label="Email Address" value={editing.email} />

            {isEdit ? (
              <>
                <Field
                  label="Old Password"
                  value=""
                  type="password"
                  placeholder="Enter current password"
                />
                <Field
                  label="New Password"
                  value=""
                  type="password"
                  placeholder="Enter new password"
                />
                <Button tone="teal" onClick={save}>
                  Update
                </Button>
              </>
            ) : (
              <>
                <Field label="Password" value="" type="password" />
                <Button tone="dark" onClick={save}>
                  Add
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </DottedCard>
  );
}