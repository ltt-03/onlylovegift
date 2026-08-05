/**
 * Polyfill stubs cho các GSAP Club plugin (DrawSVG, MorphSVG, Physics2D, EasePack)
 * Thay thế bằng fallback animation để tránh crash khi không có license.
 * 
 * DrawSVG → không stroke animation (các path vẫn hiển thị, chỉ không có hiệu ứng "vẽ ra")
 * MorphSVG → không morph, chỉ giữ nguyên hình
 * Physics2D → simulate bằng CSS random animation đơn giản
 */

// ===================== MorphSVGPlugin stub =====================
var MorphSVGPlugin = {
  version: "3.0.0-stub",
  name: "morphSVG",
  convertToPath: function(selector) {
    // Không cần convert, các polygon vẫn hiển thị bình thường
    // Chỉ log để debug
    console.log("[MorphSVG stub] convertToPath called for:", selector);
  },
  getRawPath: function(el) {
    // Trả về mảng rỗng an toàn
    return [[]];
  }
};

// ===================== DrawSVGPlugin stub =====================
var DrawSVGPlugin = {
  version: "3.0.0-stub",
  name: "drawSVG",
  // Plugin tự đăng ký với gsap khi được load
  // Stub này chỉ ngăn lỗi "DrawSVGPlugin is not defined"
  init: function() { return true; },
  render: function() {}
};

// Đăng ký DrawSVGPlugin stub với GSAP nếu gsap đã load
(function() {
  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    // Tạo plugin giả xử lý drawSVG property
    var stubPlugin = {
      name: "drawSVG",
      init: function(target, values) {
        // Không làm gì - các path vẫn hiển thị đầy đủ
        return true;
      },
      render: function(progress, data) {}
    };
    try { gsap.registerPlugin(stubPlugin); } catch(e) {}
  }
})();

// ===================== Physics2DPlugin stub =====================
// Thay bằng logic random animation đơn giản không cần plugin
var Physics2DPlugin = {
  version: "3.0.0-stub",
  name: "physics2D"
};

// Patch GSAP để xử lý physics2D property mà không crash
(function() {
  if (typeof gsap === 'undefined') return;
  
  var origTimeline = gsap.timeline.bind(gsap);
  // Override gsap.to để bỏ qua physics2D và thay bằng animation đơn giản
  var origTo = gsap.to.bind(gsap);
  
  // Monkey-patch để khi có physics2D trong vars, tạo animation thay thế
  var _origTo = gsap.to;
  gsap.to = function(targets, vars) {
    if (vars && vars.physics2D) {
      var p2d = vars.physics2D;
      // Tạo animation thay thế: di chuyển ngẫu nhiên và thu nhỏ
      var angle = (p2d.angle || 0) * Math.PI / 180;
      var vel = Math.abs(p2d.velocity || 50);
      var grav = p2d.gravity || 20;
      var dur = vars.duration || 2;
      
      var newVars = Object.assign({}, vars);
      delete newVars.physics2D;
      newVars.x = '+=' + (Math.cos(angle) * vel * dur * 0.3);
      newVars.y = '+=' + (Math.sin(angle) * vel * dur * 0.3 + grav * dur * 0.1);
      newVars.ease = newVars.ease || 'power2.out';
      
      return _origTo.call(gsap, targets, newVars);
    }
    return _origTo.apply(gsap, arguments);
  };
})();

// ===================== EasePack stub =====================
// GSAP v3 đã có hầu hết ease, chỉ cần stub "rough" ease
(function() {
  if (typeof gsap === 'undefined') return;
  // Nếu "rough" ease chưa có thì dùng "power1" thay thế
  var origParseEase = gsap.parseEase;
  if (origParseEase) {
    gsap.parseEase = function(ease) {
      if (typeof ease === 'string' && ease.startsWith('rough(')) {
        return origParseEase('power1.inOut');
      }
      return origParseEase.apply(this, arguments);
    };
  }
})();

console.log("[GSAP Stubs] Paid plugin stubs loaded. Animations will use fallbacks.");
