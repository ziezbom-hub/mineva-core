export default function NotificationPanel({
  isOpen,
  notifications,
  markAsRead,
  deleteNotif
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
      <div className="p-4 font-semibold border-b">
        Notifikasi
      </div>

      {notifications.length === 0 && (
        <p className="p-4 text-sm text-gray-500">
          Tidak ada notifikasi
        </p>
      )}

      {notifications.map(notif => (
        <div
          key={notif.id}
          onClick={() => markAsRead(notif.id)}
          className={`p-4 cursor-pointer hover:bg-gray-100 ${
            notif.isRead ? "opacity-60" : ""
          }`}
        >
          <div className="font-medium">{notif.title}</div>
          <div className="text-sm text-gray-500">
            {notif.message}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNotif(notif.id);
            }}
            className="text-xs text-red-500 mt-2"
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}
