import { useRouter } from "next/navigation";
import { FC, MouseEvent, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeleteIcon from "@/components/icons/DeleteIcon";

import useDeleteLink from "@/hooks/useDeleteLink";

interface DialogProps {
  originalUrl: string;
  urlId: string;
}

const DeleteLinkDialog: FC<DialogProps> = ({ originalUrl, urlId }) => {
  const router = useRouter();
  const { deleteLink } = useDeleteLink();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: MouseEvent, longUrl: string) => {
    e.preventDefault();

    setIsLoading(true);
    await deleteLink(longUrl.trim());
    setIsLoading(false);
    router.refresh();
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="ml-1" variant="destructive">
                <DeleteIcon />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new shortcut</DialogTitle>
          <DialogDescription>
            Insert a long link bellow, we&apos;ll make it shorter
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          Are you sure you want to delete the shortcut to the following URL?{" "}
          <a
            className="text-sky-500 underline"
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {originalUrl}
          </a>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="default">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, urlId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLinkDialog;
