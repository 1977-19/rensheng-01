import Foundation

/// Persists the game's key/value data (saves, settings, VIP) as a JSON file in Application Support.
/// The web layer mirrors every write here, so data survives even if WebKit storage is cleared
/// (for example after re-signing the app).
final class Store {
    static let shared = Store()

    private let queue = DispatchQueue(label: "mylife.store")
    private var data: [String: String] = [:]
    private var dirty = false
    private let fileURL: URL

    private init() {
        let fm = FileManager.default
        let base = (try? fm.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true))
            ?? fm.temporaryDirectory
        let dir = base.appendingPathComponent("MyLife", isDirectory: true)
        try? fm.createDirectory(at: dir, withIntermediateDirectories: true)
        fileURL = dir.appendingPathComponent("store.json")
        if let raw = try? Data(contentsOf: fileURL),
           let obj = try? JSONSerialization.jsonObject(with: raw) as? [String: String] {
            data = obj
        }
    }

    /// JSON object literal injected into the page before any script runs.
    func snapshotJSON() -> String {
        return queue.sync {
            guard let raw = try? JSONSerialization.data(withJSONObject: data),
                  let s = String(data: raw, encoding: .utf8) else { return "{}" }
            return s
        }
    }

    func set(_ key: String, _ value: String?) {
        queue.async {
            if let v = value { self.data[key] = v } else { self.data.removeValue(forKey: key) }
            if !self.dirty {
                self.dirty = true
                self.queue.asyncAfter(deadline: .now() + 0.6) { self.writeLocked() }
            }
        }
    }

    func flush() {
        queue.sync { self.writeLocked() }
    }

    private func writeLocked() {
        guard dirty else { return }
        dirty = false
        if let raw = try? JSONSerialization.data(withJSONObject: data) {
            try? raw.write(to: fileURL, options: .atomic)
        }
    }
}
