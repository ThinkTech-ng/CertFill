"use client";
import DynamicForm, {
  DynamicArrayForm,
} from "@/components/organism/forms/dynamic";
import { FormField } from "@/interface/form.dto";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/molecule/button";
import { Bolt, Check, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/molecule/dropdown-menu";
import { Input } from "@/components/molecule/input";
import customFetch from "@/service/https";
import { createProgram } from "@/service/programs";
import { toast } from "sonner";
import { AppContext } from "@/service/context";
import React from "react"
export default function CreateProject() {
  const router = useRouter();
  const { setUser, removeUser, setConfig } = React.use(AppContext);
  const formSettings: FormField[] = [
    {
      type: "text",
      name: "name",
      label: undefined,
      placeholder: "Program Name",
      validation: z.string().min(4, "Enter a valid Project name."),
    },
    {
      type: "textarea",
      name: "description",
      label: undefined,
      placeholder: "Description",
      validation: z.string().min(4, "Enter a valid Description."),
    },
    {
      type: "hidden",
      name: "paymentPlan",
      label: undefined,
      placeholder: "Course / Cohort/Grade",
      validation: z.string().min(4, "Select a plan"),
    },
    {
      type: "hidden",
      name: "courses",
      label: undefined,
      placeholder: "Course / Cohort/Grade",
      validation: z.array(
        z.object({
          name: z.string().min(1, "Course / Cohort/Grade information required"),
        })
      ),
    },
  ];

  const paymentPlan = [
    {
      label: "Insuer pays",
      description: "Admin pays ₦1000 per certificate",
      value: "issuer",
    },
    {
      label: "Receivers pays",
      description:
        "Each attendee pays ₦1000 to download, with a 70-30 split between CertFill and the issuer",
      value: "receiver",
    },
  ];

  const onSubmit = (_: any) => async (data: { description: string; name: string }) => {
    try {
    setConfig({ loading: true })

      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);

      const payload = {
        ...data,
        startDate: new Date().toISOString(),
        endDate: date.toISOString(),
      };
      const response = await createProgram(payload);
      toast.success(`Your program "${data.name}" was created successfully `)
      return router.push(`/admin/projects/${response.data._id}/courses`)
    } catch (e) {
    setConfig({ loading: false })

      toast.success((e as Error).message || `Could not complete program `)
    }
  };

  React.useEffect(()=>{
    setConfig({ loading: false })
    return ()=>  setConfig({ loading: false })

  }, [])

  return (
    <div className="p-5 pb-20 flex flex-col gap-5 h-full py-12 justify-between relative">
      <h2 className="text-2xl sm:text-3xl">Add programs or courses</h2>

      <DynamicForm
        onSubmit={onSubmit as any}
        formSettings={formSettings}
        hideError
        defaultValues={{ paymentPlan: "issuer", courses: [{ name: "" }] }}
      >
        {(form) => (
          <div className="pb-28">
            <div className="absolute right-5 top-10 bg-white">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[50px] outline outline-0 flex justify-end pb-5">
                  <Bolt />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-whiteout p-8 w-[300px] min-h-[300px] drop-shadow-xl sm:absolute right-0 sm:-mr-5">
                  <div className="h-full">
                    <h5 className="text-xl font-semibold pb-4 mb-3 border-b border-b-jumbo">
                      Payment Option
                    </h5>
                    {paymentPlan.map((plan) => (
                      <div
                        key={plan.label}
                        className="py-3 cursor-pointer flex"
                        onClick={() => {
                          form.setValue("paymentPlan", plan.value, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <div className="flex-1">
                          <span className="text-lg text-black block">
                            {plan.label}
                          </span>
                          <span className="text-jumbo text-sm">
                            {plan.description}
                          </span>
                        </div>
                        {form?.getValues("paymentPlan") === plan.value && (
                          <Check className="text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DynamicArrayForm name="courses" control={form.control}>
              {(array) => {
                return (
                  <>
                    {array.fields.map((field, index) => (
                      <div className="flex items-center gap-2  my-2.5 relative">
                        <Input
                          key={field.id}
                          className="h-[46px]"
                          id={`${"courses"}.${field.id}`}
                          placeholder={"Course / Cohort/Grade"}
                          value={form.getValues(`${"courses"}.${index}.name`)}
                          onChange={(e) =>
                            form.setValue(
                              `${"courses"}.${index}.name`,
                              e.target.value,
                              { shouldValidate: true }
                            )
                          }
                        />
                        {array.fields.length > 1 && (
                          <Button
                            variant={"outline"}
                            className="absolute right-0 top-0 font-medium p-6 w-[20px] border-none hover:bg-transparent"
                            onClick={() => array.remove(index)}
                          >
                            <Trash2 className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant={"dotted"}
                      className="font-medium p-6 w-full border-jumbo"
                      onClick={() => array.append({ name: "" })}
                    >
                      <span className="text-jumbo text-base font-light">
                        Add Learning Track / Course
                      </span>
                    </Button>
                  </>
                );
              }}
            </DynamicArrayForm>

            <br />
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
              className="w-full h-[46px] text-base  mt-4"
            >
              Save
            </Button>
          </div>
        )}
      </DynamicForm>
    </div>
  );
}
