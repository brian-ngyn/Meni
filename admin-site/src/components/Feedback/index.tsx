import { useState } from "react";

import { useUser } from "@clerk/nextjs";
import CloseIcon from "@mui/icons-material/Close";

import { api } from "~/utils/api";

import MeniNotification from "~/components/items/MeniNotification";

const Feedback = () => {
  const { user } = useUser();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { mutate } = api.feedback.sendFeedback.useMutation({
    onSuccess: (a) => {
      if (a.success) {
        setFeedbackModalOpen(false);
        setFeedbackMessage("");
        MeniNotification(
          "Success",
          "Feedback has been successfully received. Thank you for your continued support!",
          "success",
        );
      } else {
        MeniNotification(
          "Error",
          "Failed to send feedback. Please try again later or contact support.",
          "error",
        );
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        MeniNotification("Error", errorMessage[0], "error");
      } else {
        MeniNotification(
          "Error",
          "Failed to send feedback. Please try again later or contact support.",
          "error",
        );
      }
    },
  });

  return (
    <>
      {user && !!user.publicMetadata.onboardingComplete && (
        <>
          <button
            onClick={() => setFeedbackModalOpen((prev) => !prev)}
            className="fixed bottom-2 left-2 rounded bg-blue-400 p-3 font-sans text-white"
          >
            Feedback
          </button>
          {feedbackModalOpen && (
            <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/50">
              <div className="flex h-full w-full items-center justify-center">
                <div className="relative rounded-md bg-white/100 px-48 py-60 shadow-xl">
                  <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-y-2 p-8 font-sans text-xl text-black">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xl font-semibold">Feedback</div>
                      <CloseIcon
                        className="cursor-pointer"
                        onClick={() => setFeedbackModalOpen((prev) => !prev)}
                      />
                    </div>
                    <div className="mt-6 flex grow flex-col gap-y-4">
                      <div>
                        Thanks for helping to test Meni, we appreciate any
                        feedback!
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm">
                          Message
                        </label>

                        <textarea
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          rows={6}
                          id="message"
                          className="mt-1 w-full rounded-md border-gray-200 p-2 shadow-sm focus:border-gray-700 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (feedbackMessage.length > 0) {
                          mutate({
                            clerkId: user.id,
                            content: feedbackMessage,
                          });
                        }
                      }}
                      className="inline-block rounded border border-backdrop bg-backdrop px-12 py-3 text-sm font-medium text-white"
                    >
                      Submit
                    </button>
                    <div className="text-center text-sm">
                      Your email and restaurant information will be included in
                      your message. Thank you!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Feedback;
