"use client";
import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogo.svg";
import Projects from "./projects";
import AppLayout from "@/components/template/layout";
import { AppContext } from "@/service/context";
import React, { useState } from "react";
import { LoginUser } from "@/interface/user.dto";
import { InfoCard, ListCard } from "@/components/molecule/info-card";
import { Button } from "@/components/molecule/button";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPrograms, deleteProgram } from "@/service/programs";
import { LoaderCircleIcon } from "lucide-react";
import { formatToSocialMediaNumber } from "@/utils/utils";
import { LoadingAtom } from "@/components/atom/loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/molecule/confirm-modal";

export default function Admin() {
  const { user } = React.use(AppContext);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const { data: { programs, stats } = {}, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: getMyPrograms,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries("programs");
      toast.success("Program deleted successfully!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete program: ${error.message}`);
      setIsModalOpen(false);
    },
  });

  const actions = [
    { text: "Edit" },
    { text: "Delete", className: "text-red-600" },
  ];

  const onAction =
    (program: Record<string, any>) => async (data: Record<string, any>) => {
      if (data.action.text === "Edit") {
        toast.info(`Opening program, please wait.`);
        router.push(`/admin/projects/${program._id}/courses`);
        return;
      }
      if (data.action.text === "Delete") {
        setProgramToDelete(program._id);
        setIsModalOpen(true);
      }
    };

  const handleConfirmDelete = () => {
    if (programToDelete) {
      deleteMutation.mutate(programToDelete);
    }
  };

  React.useEffect(() => {
    router.prefetch("/admin/projects/create");
    router.prefetch("/admin/projects/any/courses");
  }, []);

  return (
    <div className="min-h-screen h-full p-5 py-0">
      <span className="text-2xl sm:text-3xl">
        Welcome {user?.user?.name?.split(" ")[0]}!
      </span>

      <div className="grid grid-cols-2 gap-2 pt-14 sm:pt-28 pb-14">
        <InfoCard
          title={formatToSocialMediaNumber(stats?.count || 0)}
          description="programs"
        />
        <InfoCard
          title={formatToSocialMediaNumber(0)}
          description="downloads"
          className="bg-secondary"
        />
      </div>

      <Link href="/admin/projects/create">
        <Button
          variant={"dotted"}
          className="font-medium p-6 w-full border-black"
        >
          Create New Certificate
        </Button>
      </Link>
      {programs?.length <= 0 && !isLoading && (
        <div className="w-full flex items-center gap-5 pt-10 pb-5 font-medium texr-center">
          You have not created any program yet
        </div>
      )}

      {isLoading && <LoadingAtom />}

      {programs?.length > 0 && (
        <div className="flex items-center gap-5 pt-10 pb-5">
          <span className="font-medium">PAST PROGRAMS</span>
          <hr className="flex-1 border-jumbo" />
        </div>
      )}

      <div>
        {programs?.map?.((program) => {
          return (
            <ListCard
              key={program._id}
              title={program.name}
              actions={actions}
              onAction={onAction(program)}
            />
          );
        })}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this program?"
      />
    </div>
  );
}
