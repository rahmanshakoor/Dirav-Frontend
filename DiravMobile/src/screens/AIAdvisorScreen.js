import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinances } from '../context/FinancesContext';
import colors from '../constants/colors';

const AIAdvisorScreen = () => {
  const { user, balance, savings, transactions } = useFinances();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Initialize with a personalized welcome message
  useEffect(() => {
    const userName = user?.first_name || 'there';
    const hasTransactions = transactions.length > 0;
    
    let welcomeMessage = `Hello ${userName}! 👋 I'm your personal financial advisor. `;
    
    if (hasTransactions) {
      welcomeMessage += `I can see you have ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} recorded. `;
    }
    
    welcomeMessage += `Feel free to ask me anything about budgeting, saving, or managing your finances!`;
    
    setMessages([{
      id: 1,
      sender: 'bot',
      text: welcomeMessage
    }]);
  }, [user, transactions.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    // Generate contextual response based on user's financial data
    setTimeout(() => {
      const response = generateResponse(userInput);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: response
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Budget/spending related
    if (lowercaseInput.includes('budget') || lowercaseInput.includes('spend')) {
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return `Based on your records, you've spent $${totalExpenses.toFixed(2)} in total expenses. A good budgeting practice is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Would you like me to help you create a budget plan?`;
    }
    
    // Savings related
    if (lowercaseInput.includes('save') || lowercaseInput.includes('saving')) {
      return `You currently have $${savings.toFixed(2)} in savings. Great job! A good target is to have 3-6 months of expenses saved as an emergency fund. Consider setting up automatic transfers to your savings account on payday to make saving effortless.`;
    }
    
    // Balance related
    if (lowercaseInput.includes('balance') || lowercaseInput.includes('money')) {
      return `Your current balance is $${balance.toFixed(2)}. To maintain a healthy balance, try to keep at least one month's worth of expenses as a buffer. This helps you avoid overdrafts and gives you flexibility for unexpected costs.`;
    }
    
    // Goals related
    if (lowercaseInput.includes('goal')) {
      return `Setting financial goals is a great step! Start with SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound. For example, "Save $500 for an emergency fund in 3 months" is better than "save more money." Would you like to set up a new savings goal?`;
    }
    
    // Investment related
    if (lowercaseInput.includes('invest')) {
      return `Before investing, make sure you have: 1) An emergency fund (3-6 months expenses), 2) No high-interest debt. For beginners, consider starting with index funds or ETFs which offer diversification at low cost. Remember, investing involves risk - only invest what you can afford to lose.`;
    }
    
    // Default helpful response
    return `That's a great question! Here are some general tips I can help you with:\n\n• Track all your expenses\n• Set realistic savings goals\n• Review your budget monthly\n• Build an emergency fund\n\nWould you like me to elaborate on any of these topics?`;
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <View style={[styles.messageContainer, isBot ? styles.botContainer : styles.userContainer]}>
        <View style={[styles.avatar, isBot ? styles.botAvatar : styles.userAvatar]}>
          <Ionicons 
            name={isBot ? 'sparkles' : 'person'} 
            size={16} 
            color={isBot ? colors.white : colors.textMuted} 
          />
        </View>
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AI Advisor</Text>
          <Ionicons name="sparkles" size={24} color={colors.primary} />
        </View>
        <Text style={styles.subtitle}>Get personalized financial advice powered by AI.</Text>
      </View>

      {/* Chat Area */}
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          ) : null}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about budgeting, saving, investing..."
            placeholderTextColor={colors.textLight}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.bgMain,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textMain,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  botContainer: {
    flexDirection: 'row',
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  botAvatar: {
    backgroundColor: colors.primary,
  },
  userAvatar: {
    backgroundColor: colors.borderLight,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: colors.bgMain,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  botText: {
    color: colors.textMain,
  },
  userText: {
    color: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgMain,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
    color: colors.textMain,
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default AIAdvisorScreen;
