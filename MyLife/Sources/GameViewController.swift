import UIKit
import WebKit

/// Avoids the retain cycle between WKUserContentController and the view controller.
private final class WeakHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }
    func userContentController(_ c: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(c, didReceive: message)
    }
}

final class GameViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
    private var webView: WKWebView!
    private let paper = UIColor { trait in
        trait.userInterfaceStyle == .dark
            ? UIColor(red: 0x1d / 255.0, green: 0x3a / 255.0, blue: 0x2e / 255.0, alpha: 1)
            : UIColor(red: 0xf6 / 255.0, green: 0xf9 / 255.0, blue: 0xf3 / 255.0, alpha: 1)
    }

    override func loadView() {
        let content = WKUserContentController()
        let handler = WeakHandler(self)
        ["store", "haptic", "http", "log"].forEach { content.add(handler, name: $0) }

        // Preload persisted data before any page script runs.
        let boot = "window.__NATIVE_STORE = \(Store.shared.snapshotJSON()); window.__IS_APP = true;"
        content.addUserScript(WKUserScript(source: boot, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        let config = WKWebViewConfiguration()
        config.userContentController = content
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default()

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = paper
        webView.scrollView.backgroundColor = paper
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsLinkPreview = false
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = paper
        guard let index = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web") else {
            webView.loadHTMLString("<h2 style='font-family:-apple-system;padding:40px'>web/index.html missing</h2>", baseURL: nil)
            return
        }
        webView.loadFileURL(index, allowingReadAccessTo: index.deletingLastPathComponent())
    }

    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .portrait }

    // MARK: - JS bridge

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "store":
            guard let body = message.body as? [String: Any], let key = body["k"] as? String else { return }
            Store.shared.set(key, body["v"] as? String)
        case "haptic":
            haptic(message.body as? String ?? "light")
        case "http":
            guard let body = message.body as? [String: Any] else { return }
            http(body)
        default:
            if let s = message.body as? String { print("[web]", s) }
        }
    }

    private func haptic(_ kind: String) {
        switch kind {
        case "success": UINotificationFeedbackGenerator().notificationOccurred(.success)
        case "error": UINotificationFeedbackGenerator().notificationOccurred(.error)
        case "heavy": UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case "medium": UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        default: UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
    }

    /// Performs AI chat requests natively so they are not blocked by CORS.
    private func http(_ body: [String: Any]) {
        let id = body["id"] as? Int ?? 0
        guard let urlStr = body["url"] as? String, let url = URL(string: urlStr) else {
            reply(id, ok: false, text: "Invalid URL"); return
        }
        var req = URLRequest(url: url, timeoutInterval: 60)
        req.httpMethod = "POST"
        (body["headers"] as? [String: String])?.forEach { req.setValue($0.value, forHTTPHeaderField: $0.key) }
        if let b = body["body"] as? String { req.httpBody = b.data(using: .utf8) }
        URLSession.shared.dataTask(with: req) { [weak self] data, resp, err in
            let text = data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
            let code = (resp as? HTTPURLResponse)?.statusCode ?? 0
            if let err = err {
                self?.reply(id, ok: false, text: err.localizedDescription)
            } else if code < 200 || code >= 300 {
                self?.reply(id, ok: false, text: "HTTP \(code) \(text.prefix(300))")
            } else {
                self?.reply(id, ok: true, text: text)
            }
        }.resume()
    }

    private func reply(_ id: Int, ok: Bool, text: String) {
        guard let data = try? JSONSerialization.data(withJSONObject: [text]),
              let arr = String(data: data, encoding: .utf8) else { return }
        let js = "G.native.httpCallback(\(id), \(ok ? "true" : "false"), \(arr)[0]);"
        DispatchQueue.main.async { self.webView.evaluateJavaScript(js, completionHandler: nil) }
    }

    // MARK: - Navigation

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url, url.scheme == "http" || url.scheme == "https" {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }

    // Native alerts in case the page ever uses them.
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(a, animated: true)
    }
}
