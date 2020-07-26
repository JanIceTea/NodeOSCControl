//
//  AppDelegate.m
//  BonjourPublisher
//
//  Created by Jan von Falkenstein on 21/09/14.
//  Copyright (c) 2014 teatracks. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()<NSNetServiceDelegate>

@property (weak) IBOutlet NSWindow *window;
@end

@implementation AppDelegate
{
    NSNetService *_service;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {

    _service = [[NSNetService alloc] initWithDomain:@"local."
                                              type:@"_music._tcp"
                                              name:@"aim_server"
                                              port:11000];
    if(_service)
    {
        [_service setDelegate:self];// 2
        [_service publish];// 3
    }
    else
    {
        NSLog(@"An error occurred initializing the NSNetService object.");
    }

}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
}

- (void)netServiceWillPublish:(NSNetService *)sender
{
    
}

- (void)netServiceDidPublish:(NSNetService *)sender
{
    
}

- (void)netService:(NSNetService *)sender didNotResolve:(NSDictionary *)errorDict
{
    
}

- (void)netServiceDidResolveAddress:(NSNetService *)sender
{
    
}

- (void)netService:(NSNetService *)sender didNotPublish:(NSDictionary *)errorDict
{
    
}

@end
