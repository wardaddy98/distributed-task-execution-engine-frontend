import { useId, useState } from "react";
import { toast } from "react-toastify";
import { parseJsonObject } from "../../utils/json";
import Button from "../Button";
import { post } from "../../service/api";

const TASK_TYPES = ["image_processing", "report_generation", "deliberate_fail_task"];
const PRIORITIES = [1, 2, 3, 4, 5];

const fieldClassName =
  "min-h-10 w-full rounded-md border border-slate-500 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

const TaskForm = () => {
  const [formValues, setFormValues] = useState({
    type: "",
    priority: "",
    payload: "{}",
  });
  const typeId = useId();
  const priorityId = useId();
  const payloadId = useId();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.type) return toast.error("Type is required");
    if (!formValues.priority) return toast.error("Priority is required");

    const parsedPayload = parseJsonObject(formValues.payload);
    if (parsedPayload?.error) return toast.error(parsedPayload.error);

    try {
      await post("/task", {
        ...formValues,
        payload: parsedPayload?.value,
      });
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-50">Submit a task</h2>

      <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor={typeId}
              className="block text-sm font-medium text-slate-200"
            >
              Type
            </label>
            <select
              id={typeId}
              name="type"
              value={formValues.type}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="" disabled>
                Select type
              </option>
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={priorityId}
              className="block text-sm font-medium text-slate-200"
            >
              Priority
            </label>
            <select
              id={priorityId}
              name="priority"
              value={formValues.priority}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="" disabled>
                Select priority
              </option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={payloadId}
            className="block text-sm font-medium text-slate-200"
          >
            Payload{" "}
            <span className="font-normal text-slate-400">
              (optional JSON object)
            </span>
          </label>
          <textarea
            id={payloadId}
            name="payload"
            value={formValues.payload}
            onChange={handleChange}
            rows={2}
            wrap="off"
            spellCheck={false}
            className={`${fieldClassName} resize-y font-mono leading-relaxed`}
          />
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <Button type="submit" className="w-full sm:w-auto">
            Submit task
          </Button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
