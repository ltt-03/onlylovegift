import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Chào bạn! 👋 Mình là AI trợ lý của Only Love Gift. Bạn muốn tự điền thông tin hay gửi yêu cầu để mình tạo tự động giúp bạn?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    // Simulate AI parsing logic
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      // Simple mock AI logic to detect form filling intent
      if (lowerText.includes('tạo') || lowerText.includes('cho') || lowerText.includes('tên')) {
        
        // Mock extracted data
        const extractedData = {
          senderName: 'Tuấn', // Hardcoded mock extraction
          receiverName: 'Mai',
          message: 'Chúc em luôn vui vẻ và hạnh phúc nhé!',
          templateId: 'love-box-01'
        };

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Mình đã phân tích yêu cầu của bạn. Mình sẽ điền mẫu "Hộp Quà Sinh Nhật 3D" với người gửi là Tuấn, người nhận là Mai. Bạn có muốn mình điền giúp luôn không?',
          action: {
            type: 'fill_form',
            data: extractedData,
            label: 'Đồng ý & Điền Form'
          }
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Bạn có thể nói rõ hơn được không? Ví dụ: "Tạo cho tôi một hộp quà, tôi tên Tuấn tặng cho Mai". Mình sẽ tự động trích xuất và điền giúp bạn nhé.'
        }]);
      }
    }, 1000);
  };

  const handleAction = (action) => {
    if (action.type === 'fill_form') {
      const { templateId, senderName, receiverName, message } = action.data;
      // Navigate to customize page with query params
      const params = new URLSearchParams({
        senderName,
        receiverName,
        message,
        autoFill: 'true'
      });
      if (templateId === 'x-mas-tree') {
        navigate(`/create/x-mas-tree?${params.toString()}`);
      } else {
        params.append('template', templateId);
        navigate(`/create?${params.toString()}`);
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        className="ai-chat-btn"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 1000,
          border: 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        <MessageCircle size={32} />
      </button>

      <div 
        className="ai-chat-window"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '350px',
          height: '500px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ padding: '16px', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Only Love Gift AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--color-background)' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <div style={{ display: 'flex', gap: '8px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: msg.sender === 'user' ? 'var(--color-border)' : 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {msg.sender === 'user' ? <User size={16} color="var(--color-text)" /> : <Bot size={16} color="white" />}
                </div>
                <div style={{ backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface)', color: msg.sender === 'user' ? 'white' : 'var(--color-text)', padding: '10px 14px', borderRadius: '16px', borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px', borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '16px', fontSize: '0.95rem', boxShadow: 'var(--shadow-sm)', border: msg.sender === 'ai' ? '1px solid var(--color-border)' : 'none' }}>
                  {msg.text}
                </div>
              </div>
              {/* Action Button */}
              {msg.action && (
                <button
                  onClick={() => handleAction(msg.action)}
                  style={{
                    marginLeft: '36px',
                    padding: '8px 16px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  {msg.action.label}
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px' }}>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Nhập yêu cầu để AI tạo..." style={{ flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', outline: 'none', fontFamily: 'var(--font-body)' }} />
          <button type="submit" style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </>
  );
}
