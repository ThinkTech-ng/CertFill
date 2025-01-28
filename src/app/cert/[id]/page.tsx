"use client"
import { LoadingAtom } from "@/components/atom/loading";
import { CertificateNotFound } from "@/components/template/layout/certificate/not-found";
import { PaidCertificate } from "@/components/template/layout/certificate/paid-certificate";
import { fetchUserCertificate } from "@/service/programs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
export default function ViewOrDownloadCert(){
  const { id } = useParams();
  const { data: programs = {}, isLoading, error } = useQuery({
    queryKey: ["my-cert"],
    queryFn: async ()=> await fetchUserCertificate({  id }),
  });
  if (isLoading) {
    return <LoadingAtom />
  }
  if (error || !programs?.data){
    return <CertificateNotFound />
  }

    return <PaidCertificate program={programs.data} />

}