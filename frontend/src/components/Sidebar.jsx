import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus, X, UsersRound } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    getGroups,              // ✅ NEW
    users,
    groups,                 // ✅ NEW
    selectedUser,
    selectedGroup,          // ✅ NEW
    setSelectedUser,
    setSelectedGroup,       // ✅ NEW
    isUsersLoading,
    createGroup,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // GROUP MODAL STATE
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getUsers();
    getGroups(); // ✅ FETCH GROUPS
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length < 2) return;

    const result = await createGroup(groupName, selectedMembers);
    if (result) {
      setShowCreateGroup(false);
      setGroupName("");
      setSelectedMembers([]);
      getGroups(); // refresh groups list
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        {/* HEADER */}
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Chats</span>
            </div>

            <button
              onClick={() => setShowCreateGroup(true)}
              className="hidden lg:flex items-center gap-1 text-sm px-2 py-1 rounded-md 
                         bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Group
            </button>
          </div>

          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>

        {/* ================= GROUPS ================= */}
        {groups.length > 0 && (
          <div className="px-3 pt-3">
            <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-zinc-400 mb-2">
              <UsersRound className="size-4" />
              Groups
            </div>

            {groups.map((group) => (
              <button
                key={group.groupId}
                onClick={() => setSelectedGroup(group)}
                className={`
                  w-full p-3 flex items-center gap-3 rounded-lg
                  hover:bg-base-300 transition-colors
                  ${
                    selectedGroup?.groupId === group.groupId
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }
                `}
              >
                <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {group.groupName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden lg:block text-left">
                  <div className="font-medium truncate">
                    {group.groupName}
                  </div>
                  <div className="text-xs text-zinc-400">Group</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ================= USERS ================= */}
        <div className="overflow-y-auto w-full py-3">
          <div className="hidden lg:block px-3 text-sm font-semibold text-zinc-400 mb-2">
            Contacts
          </div>

          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= CREATE GROUP MODAL ================= */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 w-full max-w-md rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Group</h2>
              <button onClick={() => setShowCreateGroup(false)}>
                <X />
              </button>
            </div>

            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full mb-3"
            />

            <p className="text-sm text-zinc-400 mb-2">
              Select at least 2 members (you are added automatically)
            </p>

            <div className="max-h-48 overflow-y-auto border rounded-md p-2">
              {users
                .filter((u) => u._id !== authUser._id)
                .map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                      className="checkbox checkbox-sm"
                    />
                    <span>{user.fullName}</span>
                  </label>
                ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="btn btn-primary"
                disabled={!groupName || selectedMembers.length < 2}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
