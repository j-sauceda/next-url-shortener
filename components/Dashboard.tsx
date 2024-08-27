"use client";

import { useContext, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";

import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableCaption,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import CopyIcon from "@/components/icons/CopyIcon";
import { useToast } from "@/components/ui/use-toast";
import DeleteLinkDialog from "@/components/dialogs/DeleteLinkDialog";
import ShortenLinkDialog from "@/components/dialogs/ShortenLinkDialog";

import useAuth from "@/hooks/useAuth";
import useData, { IUrl } from "@/hooks/useData";
import { AuthContext } from "@/context/AuthContext";
import UpdateLinkDialog from "./dialogs/UpdateLinkDialog";

const Dashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const { data, error, isLoading } = useData();
  const { getIsAuthenticated } = useContext(AuthContext);

  useLayoutEffect(() => {
    const isAuthenticated = getIsAuthenticated();
    if (isAuthenticated === "false") {
      router.push("/");
    }
  }, [getIsAuthenticated, router]);

  useEffect(() => {
    const refreshInterval = setInterval(
      () => {
        refresh().catch((error) => {
          toast({
            title: "Session expired",
            description: "Please login again to renew your session",
          });
        });
      },
      14 * 60 * 1000,
    );

    return () => clearInterval(refreshInterval);
  }, [refresh, router, toast]);

  const onCopyLink = async (link: string) => {
    const baseUrl = window.location.href;
    await navigator.clipboard.writeText(baseUrl + link);
    toast({
      title: "Success!",
      description: "Short link copied to the clipboard",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[78vh]">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </>
    );
  }

  if (error) {
    toast({
      title: "Data error",
      description: error,
    });
  }

  return (
    <>
      <Navbar />
      <ShortenLinkDialog />
      {data && data.length > 0 ? (
        <TooltipProvider>
          <Table className="max-w-full">
            <TableCaption>
              Hover on top of a link to see its full path
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Short link</TableHead>
                <TableHead></TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead className="text-center">Visited</TableHead>
                <TableHead className="text-center">Created on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: IUrl) => (
                <TableRow key={item.urlId}>
                  <TableCell>
                    <abbr title={`${window.location.href}${item.urlId}`}>
                      <a
                        href={`/${item.urlId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        /{item.urlId}
                      </a>
                    </abbr>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => onCopyLink(item.urlId)}>
                          <CopyIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <abbr title={item.originalUrl} className="relative mr-auto">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.originalUrl.slice(0, 22) + "..."}
                      </a>
                    </abbr>
                    <UpdateLinkDialog
                      originalUrl={item.originalUrl}
                      urlId={item.urlId}
                    />
                    <DeleteLinkDialog
                      originalUrl={item.originalUrl}
                      urlId={item.urlId}
                    />
                  </TableCell>
                  <TableCell className="text-center">{item.clicks}</TableCell>
                  <TableCell className="text-center">
                    {formatDistance(new Date(), new Date(item.date))} ago
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      ) : (
        <div className="flex items-center justify-center h-[76vh]">
          <h1 className="text-2xl">Go ahead and shorten a link</h1>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Dashboard;
