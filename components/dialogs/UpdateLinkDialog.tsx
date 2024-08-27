import { useRouter } from "next/navigation";
import { ChangeEvent, FC, MouseEvent, useState } from "react";

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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

import { validateUrl } from "@/lib/utils";
import useUpdateLink from "@/hooks/useUpdateLink";
import EditIcon from "@/components/icons/EditIcon";

interface DialogProps {
  originalUrl: string;
  urlId: string;
}

const UpdateLinkDialog: FC<DialogProps> = ({ originalUrl, urlId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { updateLink } = useUpdateLink();
  const [url, setUrl] = useState(originalUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: MouseEvent, longUrl: string) => {
    e.preventDefault();

    if (longUrl === "") {
      toast({
        title: "URL error",
        description: "Empty destination URL",
      });
    } else if (!validateUrl(longUrl.trim())) {
      toast({
        title: "URL error",
        description: "Invalid URL",
      });
    } else {
      setIsLoading(true);
      await updateLink(longUrl.trim(), urlId);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button onClick={() => {}}>
                <EditIcon />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update shortcut destination</DialogTitle>
          <DialogDescription>
            Modify the long link bellow, we&apos;ll update its shortcut
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Destination URL
            </Label>
            <Input
              id="url"
              className="col-span-3"
              onChange={handleUrlChange}
              value={url}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, url)}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLinkDialog;
