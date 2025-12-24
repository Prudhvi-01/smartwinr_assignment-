import { X, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const {
    selectedUser,
    selectedGroup,
    setSelectedUser,
    setSelectedGroup,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  // Nothing selected
  if (!selectedUser && !selectedGroup) return null;

  const isGroup = Boolean(selectedGroup);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar / Icon */}
          <div className="avatar">
            <div className="size-10 rounded-full relative bg-base-300 flex items-center justify-center">
              {isGroup ? (
                <Users className="size-5" />
              ) : (
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                />
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-medium">
              {isGroup ? selectedGroup.groupName : selectedUser.fullName}
            </h3>

            {!isGroup && (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"}
              </p>
            )}

            {isGroup && (
              <p className="text-sm text-base-content/70">Group chat</p>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
