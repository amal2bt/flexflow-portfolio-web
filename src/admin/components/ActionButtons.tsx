import { Button } from "./Button";
import { Icon } from "./Icon";

export function ActionButtons({ details = false, tealEdit = false, onlyEdit = false, onEdit, onDelete, onDetails, iconOnly = false }: { details?: boolean; tealEdit?: boolean; onlyEdit?: boolean; onEdit?: () => void; onDelete?: () => void; onDetails?: () => void; iconOnly?: boolean }) {
  return <div className={`action-buttons ${iconOnly ? "icon-actions" : ""}`}>{details && <Button tone="details" onClick={iconOnly ? () => onDetails?.() : () => onDetails?.()}>{iconOnly ? <Icon name="eye" size={14} /> : "Details"}</Button>}<Button tone={tealEdit ? "teal" : "edit"} onClick={() => onEdit?.()}>{iconOnly ? <Icon name="edit" size={14} /> : "Edit"}</Button>{!onlyEdit && <Button tone="danger" onClick={() => onDelete?.()}>{iconOnly ? <Icon name="trash" size={14} /> : "Delete"}</Button>}</div>;
}
