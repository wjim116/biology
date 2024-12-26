class GitHubPagesDialog(QDialog):
    def initUI(self):
        self.setWindowTitle('GitHub Pages 设置')
        layout = QVBoxLayout(self)

        # 1. 发布模式选择
        mode_group = QWidget()
        mode_layout = QVBoxLayout(mode_group)
        mode_label = QLabel('选择发布模式:')
        mode_layout.addWidget(mode_label)
        
        self.mode_combo = QComboBox()
        self.mode_combo.addItems([
            '基础模式 - 直接发布（开源项目）',
            '保护模式 - 源码保护（商业/教育项目）',
            '文档模式 - 项目文档（/docs目录）'
        ])
        self.mode_combo.currentIndexChanged.connect(self.update_settings_for_mode)
        mode_layout.addWidget(self.mode_combo)
        
        # 2. 分支设置（动态显示）
        self.branch_settings = QWidget()
        branch_layout = QVBoxLayout(self.branch_settings)
        
        # main分支设置
        self.main_private_cb = QCheckBox('将main分支设为私有')
        branch_layout.addWidget(self.main_private_cb)
        
        # gh-pages分支设置
        self.ghpages_public_cb = QCheckBox('将gh-pages分支设为公开')
        branch_layout.addWidget(self.ghpages_public_cb)
        
        # docs目录设置
        self.docs_dir_cb = QCheckBox('启用/docs目录发布')
        branch_layout.addWidget(self.docs_dir_cb)
        
        layout.addWidget(mode_group)
        layout.addWidget(self.branch_settings)

        # 3. 主题设置
        theme_group = QWidget()
        theme_layout = QVBoxLayout(theme_group)
        theme_label = QLabel('选择主题:')
        theme_layout.addWidget(theme_label)
        
        self.theme_combo = QComboBox()
        self.theme_combo.addItems([
            '默认主题',
            'Minimal - 简约风格',
            'Cayman - 现代风格（推荐）',
            'Just-Docs - 文档专用',
            'Hacker - 极客风格'
        ])
        theme_layout.addWidget(self.theme_combo)
        layout.addWidget(theme_group)

        # 4. 高级设置
        advanced_group = QGroupBox("高级设置（点击展开）")
        advanced_group.setCheckable(True)
        advanced_group.setChecked(False)  # 默认折叠
        advanced_layout = QVBoxLayout(advanced_group)

        # 自定义域名设置
        domain_group = QWidget()
        domain_layout = QGridLayout(domain_group)

        # 域名输入
        domain_layout.addWidget(QLabel("域名:"), 0, 0)
        self.domain_input = QLineEdit()
        self.domain_input.setPlaceholderText("例如: www.your-domain.com")
        domain_layout.addWidget(self.domain_input, 0, 1)

        # DNS提供商选择
        dns_layout = QHBoxLayout()
        dns_layout.addWidget(QLabel("DNS提供商:"))
        dns_layout.addWidget(self.dns_provider)
        help_btn = QPushButton("如何获取访问权限")
        help_btn.clicked.connect(self.show_api_guide)
        dns_layout.addWidget(help_btn)
        domain_layout.addLayout(dns_layout, 1, 0, 1, 2)

        # DNS认证信息（根据提供商动态显示）
        self.dns_auth_widget = QWidget()
        self.dns_auth_layout = QFormLayout(self.dns_auth_widget)
        domain_layout.addWidget(self.dns_auth_widget, 2, 0, 1, 2)

        # 一键配置按钮
        config_btn = QPushButton("一键配置域名")
        config_btn.clicked.connect(self.configure_domain)
        domain_layout.addWidget(config_btn, 3, 0, 1, 2)

        # 添加查看指南按钮
        guide_btn = QPushButton("查看域名指南")
        guide_btn.clicked.connect(self.show_domain_guide)
        domain_layout.addWidget(guide_btn, 4, 0, 1, 2)

        advanced_layout.addWidget(domain_group)
        layout.addWidget(advanced_group)

        # 5. 状态显示
        self.status_text = QTextEdit()
        self.status_text.setReadOnly(True)
        self.status_text.setMaximumHeight(100)
        layout.addWidget(self.status_text)

    def update_settings_for_mode(self, index):
        """根据选择的模式更新设置"""
        if index == 0:  # 基础模式
            self.main_private_cb.setChecked(False)
            self.main_private_cb.setEnabled(True)
            self.ghpages_public_cb.hide()  # 不需要gh-pages分支
            self.docs_dir_cb.hide()
            self.theme_combo.setCurrentText('Cayman - 现代风格（推荐）')
            self.status_text.setText(
                "基础模式说明：\n"
                "• 直接从main分支发布\n"
                "• 适合开源项目\n"
                "• 所有代码都将公开\n"
                "• 设置最简单"
            )
            
        elif index == 1:  # 保护模式
            self.main_private_cb.setChecked(True)
            self.main_private_cb.setEnabled(False)  # 必须私有
            self.ghpages_public_cb.show()
            self.ghpages_public_cb.setChecked(True)
            self.ghpages_public_cb.setEnabled(False)  # 必须公开
            self.docs_dir_cb.hide()
            self.theme_combo.setCurrentText('Minimal - 简约风格')
            self.status_text.setText(
                "保护模式说明：\n"
                "• main分支存放源码（私有）\n"
                "• gh-pages分支存放编译后文件（公开）\n"
                "• 自动混淆和保护代码\n"
                "• 适合商业和教育项目"
            )
            
        else:  # 文档模式
            self.main_private_cb.setChecked(True)
            self.main_private_cb.setEnabled(True)
            self.ghpages_public_cb.hide()  # 不需要gh-pages分支
            self.docs_dir_cb.show()
            self.docs_dir_cb.setChecked(True)
            self.theme_combo.setCurrentText('Just-Docs - 文档专用')
            self.status_text.setText(
                "文档模式说明：\n"
                "• 使用/docs目录发布文档\n"
                "• 代码和文档在同一仓库\n"
                "• 可以选择是否公开源码\n"
                "• 适合项目文档"
            )

    def save_settings(self):
        """保存设置"""
        try:
            mode = self.mode_combo.currentIndex()
            g = Github(self.token)
            repo = g.get_repo(self.repo_name)
            
            # 1. 设置仓库可见性
            repo.edit(private=self.main_private_cb.isChecked())
            
            # 2. 根据模式配置Pages
            if mode == 0:  # 基础模式
                # 直接从main分支发布
                repo.enable_pages(
                    source={"branch": "main", "path": "/"},
                    cname=self.domain_input.text() or None
                )
                
            elif mode == 1:  # 保护模式
                # 创建并配置gh-pages分支
                try:
                    repo.get_branch('gh-pages')
                except:
                    self.create_ghpages_branch(repo)
                
                # 设置分支权限
                self.set_branch_permissions(repo)
                
                # 启用Pages
                repo.enable_pages(
                    source={"branch": "gh-pages", "path": "/"},
                    cname=self.domain_input.text() or None
                )
                
            else:  # 文档模式
                # 创建docs目录（如果不存在）
                try:
                    repo.get_contents('/docs')
                except:
                    self.create_docs_directory(repo)
                
                # 启用Pages
                repo.enable_pages(
                    source={"branch": "main", "path": "/docs"},
                    cname=self.domain_input.text() or None
                )
            
            # 3. 设置主题
            theme = self.theme_combo.currentText().split(' - ')[0].lower()
            if theme != '默认主题':
                self.set_theme(repo, theme)
            
            # 4. 配置HTTPS
            if self.force_https.isChecked():
                self.enable_https(repo)
            
            QMessageBox.information(self, '成功', 'GitHub Pages设置已更新！')
            
        except Exception as e:
            QMessageBox.critical(self, '错误', f'保存设置失败：{str(e)}')

    def create_docs_directory(self, repo):
        """创建docs目录和默认文件"""
        index_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>项目文档</title>
            <meta charset="UTF-8">
        </head>
        <body>
            <h1>���迎访问项目文档</h1>
            <p>这是您的项目文档主页。</p>
        </body>
        </html>
        """
        repo.create_file(
            '/docs/index.html',
            '创建文档目录',
            index_content
        )

    def set_branch_permissions(self, repo):
        """设置分支权限"""
        if self.main_private_cb.isChecked():
            # 设置main分支为私有
            url = f'https://api.github.com/repos/{repo.full_name}/branches/main/protection'
            headers = {
                'Authorization': f'token {self.token}',
                'Accept': 'application/vnd.github.v3+json'
            }
            data = {
                "required_status_checks": None,
                "enforce_admins": True,
                "required_pull_request_reviews": None,
                "restrictions": {
                    "users": [repo.owner.login],
                    "teams": []
                }
            }
            requests.put(url, headers=headers, json=data)
        
        if self.ghpages_public_cb.isChecked():
            # 移除gh-pages分支的保护，使其公开
            url = f'https://api.github.com/repos/{repo.full_name}/branches/gh-pages/protection'
            headers = {
                'Authorization': f'token {self.token}',
                'Accept': 'application/vnd.github.v3+json'
            }
            requests.delete(url, headers=headers) 

    def show_domain_guide(self):
        """显示域名购买指南"""
        guide_dialog = DomainGuideDialog(self)
        guide_dialog.exec_()

    def update_dns_fields(self, provider):
        """根据选择的DNS提供商更新认证字段"""
        # 清除旧的字段
        while self.dns_auth_layout.count():
            item = self.dns_auth_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        if provider == "阿里云":
            self.dns_auth_layout.addRow("AccessKey ID:", QLineEdit())
            self.dns_auth_layout.addRow("AccessKey Secret:", QLineEdit())
        elif provider == "腾讯云":
            self.dns_auth_layout.addRow("SecretId:", QLineEdit())
            self.dns_auth_layout.addRow("SecretKey:", QLineEdit())

    def configure_domain(self):
        """一键配置域名"""
        try:
            domain = self.domain_input.text()
            if not domain:
                raise ValueError("请输入域名")

            self.status_text.append("开始配置域名...")
            
            # 1. 配置DNS解析
            provider = self.dns_provider.currentText()
            if provider == "阿里云":
                self.configure_aliyun_dns(domain)
            elif provider == "腾讯云":
                self.configure_tencent_dns(domain)
            
            # 2. 配置GitHub Pages
            g = Github(self.token)
            repo = g.get_repo(self.repo_name)
            
            # 更新Pages设置
            repo.update_pages(
                cname=domain,
                https_enforced=True
            )
            
            # 3. 验证配置
            self.verify_domain_config(domain)

            self.status_text.append("域名配置完成！")
            QMessageBox.information(self, "成功", 
                f"域名配置成功！\n"
                f"• 新网址: https://{domain}\n"
                f"• DNS生效需要几分钟到几小时\n"
                f"• 请稍后访问新网址测试")

        except Exception as e:
            QMessageBox.critical(self, "错误", f"配置域名失败：{str(e)}")

    def configure_aliyun_dns(self, domain):
        """配置阿里云DNS"""
        try:
            from aliyunsdkcore.client import AcsClient
            from aliyunsdkcore.request import CommonRequest

            # 获取认证信息
            access_key = self.dns_auth_layout.itemAt(0).widget().text()
            secret = self.dns_auth_layout.itemAt(1).widget().text()

            client = AcsClient(access_key, secret, 'cn-hangzhou')
            
            # 添加CNAME记录
            request = CommonRequest()
            request.set_domain('alidns.aliyuncs.com')
            request.set_version('2015-01-09')
            request.set_action_name('AddDomainRecord')
            request.set_method('POST')
            request.add_query_param('DomainName', domain.split('.')[-2:][0])
            request.add_query_param('RR', 'www')
            request.add_query_param('Type', 'CNAME')
            request.add_query_param('Value', f'{self.repo_name.split("/")[0]}.github.io')

            response = client.do_action_with_exception(request)
            self.status_text.append("阿里云DNS配置成功")

        except Exception as e:
            raise Exception(f"配置阿里云DNS失败: {str(e)}")

    def configure_tencent_dns(self, domain):
        """配置腾讯云DNS"""
        try:
            from tencentcloud.common import credential
            from tencentcloud.dnspod.v20210323 import dnspod_client, models

            # 获取认证信息
            secret_id = self.dns_auth_layout.itemAt(0).widget().text()
            secret_key = self.dns_auth_layout.itemAt(1).widget().text()

            cred = credential.Credential(secret_id, secret_key)
            client = dnspod_client.DnspodClient(cred, "ap-guangzhou")

            # 添加CNAME记录
            request = models.CreateRecordRequest()
            request.Domain = domain.split('.')[-2:][0]
            request.RecordType = "CNAME"
            request.RecordLine = "默认"
            request.Value = f'{self.repo_name.split("/")[0]}.github.io'
            request.SubDomain = "www"

            client.CreateRecord(request)
            self.status_text.append("腾讯云DNS配置成功")

        except Exception as e:
            raise Exception(f"配置腾讯云DNS失败: {str(e)}")

    def verify_domain_config(self, domain):
        """验证域名配置"""
        self.status_text.append("正在验证域名配置...")
        
        # 等待DNS生效
        import time
        import socket
        
        max_attempts = 3
        for i in range(max_attempts):
            try:
                # 尝试解析域名
                socket.gethostbyname(domain)
                self.status_text.append("DNS解析正常")
                return
            except:
                if i < max_attempts - 1:
                    self.status_text.append(f"等待DNS生效 ({i+1}/{max_attempts})...")
                    time.sleep(20)  # 等待20秒再试
                else:
                    self.status_text.append("DNS尚未生效，请稍后访问测试")

    def show_api_guide(self):
        """显示API访问权限获取指南"""
        guide = QMessageBox(self)
        guide.setWindowTitle("如何获取API访问权限")
        guide.setTextFormat(Qt.RichText)
        guide.setText("""
            <h3>获取API访问权限（免费）</h3>
            
            <b>阿里云：</b>
            <ol>
                <li>登录阿里云控制台</li>
                <li>点击右上角头像</li>
                <li>选择"AccessKey管理"</li>
                <li>创建AccessKey
                    <ul>
                        <li>会获得AccessKey ID</li>
                        <li>会获得AccessKey Secret</li>
                    </ul>
                </li>
            </ol>

            <b>腾讯云：</b>
            <ol>
                <li>登录腾讯云控制台</li>
                <li>点击右上角头像</li>
                <li>选择"访问管理"</li>
                <li>创建密钥
                    <ul>
                        <li>会获得SecretId</li>
                        <li>会获得SecretKey</li>
                    </ul>
                </li>
            </ol>

            <p style='color:red;'>注意：请妥善保管您的访问密钥！</p>
        """)
        guide.setStandardButtons(QMessageBox.Ok)
        guide.exec_()

class DomainGuideDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.initUI()

    def initUI(self):
        self.setWindowTitle('域名购买指南')
        self.setMinimumWidth(600)
        layout = QVBoxLayout(self)

        # 创建选项卡
        tabs = QTabWidget()
        
        # 1. 价格参考选项卡
        price_widget = QWidget()
        price_layout = QVBoxLayout(price_widget)
        
        price_text = QTextEdit()
        price_text.setReadOnly(True)
        price_text.setHtml("""
            <h3>域名价格参考</h3>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <th>域名类型</th>
                    <th>首年价格</th>
                    <th>续费价格</th>
                    <th>适用场景</th>
                </tr>
                <tr>
                    <td>.com</td>
                    <td>38-50元</td>
                    <td>70-90元/年</td>
                    <td>最常用，适合商业网站</td>
                </tr>
                <tr>
                    <td>.cn</td>
                    <td>29-39元</td>
                    <td>39-59元/年</td>
                    <td>中国区域网站</td>
                </tr>
                <tr>
                    <td>.org</td>
                    <td>60-80元</td>
                    <td>90-110元/年</td>
                    <td>适合组织机构</td>
                </tr>
                <tr>
                    <td>.xyz</td>
                    <td>20-40元</td>
                    <td>40-60元/年</td>
                    <td>新项目，测试用</td>
                </tr>
                <tr>
                    <td>.top</td>
                    <td>10-30元</td>
                    <td>30-50元/年</td>
                    <td>新项目，测试用</td>
                </tr>
            </table>
            <p><small>注：价格仅供参考，具体以注册商实时价格为准</small></p>
        """)
        price_layout.addWidget(price_text)
        tabs.addTab(price_widget, "价格参考")

        # 2. 购买建议选项卡
        tips_widget = QWidget()
        tips_layout = QVBoxLayout(tips_widget)
        
        tips_text = QTextEdit()
        tips_text.setReadOnly(True)
        tips_text.setHtml("""
            <h3>域名购买建议</h3>
            <h4>1. 选择注册商</h4>
            <ul>
                <li><b>阿里云：</b>国内最大，服务稳定</li>
                <li><b>腾讯云：</b>价格实惠，活动多</li>
                <li><b>GoDaddy：</b>国际知名，种类多</li>
            </ul>
            
            <h4>2. 购买建议</h4>
            <ul>
                <li>新项目先用便宜域名测试</li>
                <li>选择大平台保证服务质量</li>
                <li>注意看续��价格</li>
                <li>可以先买一年试试</li>
                <li>留意优惠活动</li>
            </ul>
            
            <h4>3. 域名选择</h4>
            <ul>
                <li>越短越好记</li>
                <li>避免特殊字符</li>
                <li>避免容易输错的词</li>
                <li>考虑品牌价值</li>
            </ul>
        """)
        tips_layout.addWidget(tips_text)
        tabs.addTab(tips_widget, "购买建议")

        # 3. 配置教程选项卡
        setup_widget = QWidget()
        setup_layout = QVBoxLayout(setup_widget)
        
        setup_text = QTextEdit()
        setup_text.setReadOnly(True)
        setup_text.setHtml("""
            <h3>域名配置教程</h3>
            <h4>1. 购买域名后的配置步骤</h4>
            <ol>
                <li>在域名控制台添加解析记录：
                    <ul>
                        <li>记录类型：CNAME</li>
                        <li>主机记录：www</li>
                        <li>记录值：您的GitHub用户名.github.io</li>
                    </ul>
                </li>
                <li>在GitHub Pages设置中：
                    <ul>
                        <li>填入您的自定义域名</li>
                        <li>建议开启HTTPS</li>
                    </ul>
                </li>
                <li>等待DNS生效（通常需要几分钟到几小时）</li>
            </ol>
            
            <h4>2. 常见问题</h4>
            <ul>
                <li>DNS解析未生效：等待几小时再试</li>
                <li>HTTPS证书问题：确保DNS已完全生效</li>
                <li>无法访问：检查DNS记录是否正确</li>
            </ul>
        """)
        setup_layout.addWidget(setup_text)
        tabs.addTab(setup_widget, "配置教程")

        layout.addWidget(tabs)

        # 底部按钮
        btn_layout = QHBoxLayout()
        
        copy_btn = QPushButton('复制教程')
        copy_btn.clicked.connect(lambda: self.copy_content(tabs.currentWidget()))
        
        close_btn = QPushButton('关闭')
        close_btn.clicked.connect(self.accept)
        
        btn_layout.addWidget(copy_btn)
        btn_layout.addWidget(close_btn)
        layout.addLayout(btn_layout)

    def copy_content(self, current_widget):
        """复制当前选项卡的内容"""
        text_edit = current_widget.findChild(QTextEdit)
        if text_edit:
            clipboard = QApplication.clipboard()
            clipboard.setText(text_edit.toPlainText())
            QMessageBox.information(self, '成功', '��容已复制到剪贴板！')