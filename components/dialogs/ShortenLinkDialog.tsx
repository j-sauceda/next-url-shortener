import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useState } from "react";
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
import useShorterLink from "@/hooks/useShorterLink";

const ShortenLinkDialog = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const { shortenLink } = useShorterLink();
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: MouseEvent, longUrl: string) => {
    e.preventDefault();

    if (longUrl === "") {
      toast({
        title: "URL error",
        description: "Empty original URL",
      });
    } else if (!validateUrl(longUrl.trim())) {
      toast({
        title: "URL error",
        description: "Invalid URL",
      });
    } else {
      setIsLoading(true);
      await shortenLink(longUrl.trim());
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog>
      <div className="flex items-center justify-center mb-4">
        <DialogTrigger asChild>
          <Button variant="default">Create a URL shortcut</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new shortcut</DialogTitle>
          <DialogDescription>
            Insert a long link bellow, we&apos;ll make it shorter
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Original URL
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
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, url)}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default ShortenLinkDialog;
