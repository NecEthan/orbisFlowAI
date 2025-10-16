figma.showUI(__html__, {
  width: 1000,
  height: 1200,
  themeColors: true
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-text') {
    const text = figma.createText();
    
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    
    text.characters = msg.text;
    
    const center = figma.viewport.center;
    text.x = center.x - (text.width / 2);
    text.y = center.y - (text.height / 2);
    
    figma.currentPage.appendChild(text);
    figma.currentPage.selection = [text];
    figma.viewport.scrollAndZoomIntoView([text]);
    
    figma.notify(`Created: ${msg.text}`);
  }
  
  // Handle resize requests from UI
  if (msg.type === 'resize') {
    const { width, height } = msg.size;
    figma.ui.resize(width, height);
  }
  
  // Future message handlers for AI Copilot features
  if (msg.type === 'generate-feedback-response') {
    // TODO: Connect to AI backend for response generation
    figma.notify('Feedback response generation - coming soon!');
  }
  
  if (msg.type === 'run-design-review') {
    // TODO: Connect to AI backend for design review
    figma.notify('Design review analysis - coming soon!');
  }
  
  if (msg.type === 'ask-knowledge-base') {
    // TODO: Connect to knowledge base API
    figma.notify('Knowledge base query - coming soon!');
  }
  
  if (msg.type === 'create-jira-ticket') {
    // TODO: Connect to Jira API
    figma.notify('Jira ticket creation - coming soon!');
  }
};